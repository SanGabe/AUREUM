begin;

create extension if not exists pgcrypto with schema extensions;

create or replace function public.is_household_member_v12(
  target_household_id uuid,
  target_user_id uuid default auth.uid()
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.household_members hm
    where hm.household_id = target_household_id
      and hm.user_id = target_user_id
  );
$$;

revoke all on function public.is_household_member_v12(uuid, uuid) from public;
grant execute on function public.is_household_member_v12(uuid, uuid) to authenticated, service_role;

create or replace function public.is_household_member_path_v12(
  target_household_id text,
  target_user_id uuid default auth.uid()
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.household_members hm
    where hm.household_id::text = target_household_id
      and hm.user_id = target_user_id
  );
$$;

revoke all on function public.is_household_member_path_v12(text, uuid) from public;
grant execute on function public.is_household_member_path_v12(text, uuid) to authenticated, service_role;

create table if not exists public.financial_imports (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete cascade,
  channel text not null default 'web'
    check (channel in ('web', 'whatsapp', 'api')),
  source_type text not null
    check (source_type in ('csv', 'txt', 'pdf', 'ofx', 'xlsx', 'image', 'unknown')),
  original_filename text not null,
  mime_type text,
  size_bytes bigint not null default 0 check (size_bytes >= 0),
  storage_bucket text,
  storage_path text,
  content_sha256 text,
  institution_code text,
  parser_key text,
  currency text not null default 'BRL' check (currency ~ '^[A-Z]{3}$'),
  status text not null default 'queued'
    check (status in (
      'queued', 'downloading', 'parsing', 'awaiting_parser',
      'ready_for_review', 'duplicate', 'failed', 'completed'
    )),
  row_count integer not null default 0 check (row_count >= 0),
  duplicate_of uuid references public.financial_imports(id) on delete set null,
  error_code text,
  error_message text,
  metadata jsonb not null default '{}'::jsonb,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists financial_imports_household_created_idx
  on public.financial_imports (household_id, created_at desc);
create index if not exists financial_imports_owner_hash_idx
  on public.financial_imports (household_id, created_by, content_sha256)
  where content_sha256 is not null and status <> 'duplicate';
create index if not exists financial_imports_status_idx
  on public.financial_imports (status, created_at)
  where status in ('queued', 'downloading', 'parsing', 'awaiting_parser');

create table if not exists public.financial_import_rows (
  id uuid primary key default gen_random_uuid(),
  import_id uuid not null references public.financial_imports(id) on delete cascade,
  row_index integer not null check (row_index >= 0),
  occurred_on date,
  description text not null,
  amount numeric(18, 4),
  currency text not null default 'BRL' check (currency ~ '^[A-Z]{3}$'),
  proposed_type text check (proposed_type in ('income', 'expense', 'transfer', 'refund', 'unknown')),
  proposed_category_id uuid,
  proposed_account_id uuid,
  proposed_card_id uuid,
  confidence numeric(5, 4) not null default 0 check (confidence between 0 and 1),
  fingerprint text,
  duplicate_of_transaction_id uuid,
  review_status text not null default 'pending'
    check (review_status in ('pending', 'approved', 'rejected', 'needs_review', 'duplicate')),
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (import_id, row_index)
);

create index if not exists financial_import_rows_import_idx
  on public.financial_import_rows (import_id, row_index);
create index if not exists financial_import_rows_fingerprint_idx
  on public.financial_import_rows (fingerprint)
  where fingerprint is not null;
create index if not exists financial_import_rows_review_idx
  on public.financial_import_rows (review_status, created_at);

create table if not exists public.whatsapp_contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  household_id uuid not null references public.households(id) on delete cascade,
  phone_e164 text not null unique check (phone_e164 ~ '^\+[1-9][0-9]{7,14}$'),
  wa_id text,
  status text not null default 'active' check (status in ('active', 'revoked', 'blocked')),
  linked_at timestamptz not null default now(),
  last_seen_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists whatsapp_contacts_user_idx
  on public.whatsapp_contacts (user_id, household_id);

create table if not exists public.whatsapp_link_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  household_id uuid not null references public.households(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now(),
  check (expires_at > created_at)
);

create index if not exists whatsapp_link_tokens_active_idx
  on public.whatsapp_link_tokens (token_hash, expires_at)
  where consumed_at is null;

create table if not exists public.whatsapp_webhook_events (
  id uuid primary key default gen_random_uuid(),
  meta_message_id text not null unique,
  event_type text not null,
  phone_e164 text,
  payload jsonb not null,
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'processed', 'ignored', 'failed')),
  attempts integer not null default 0 check (attempts >= 0),
  next_attempt_at timestamptz not null default now(),
  locked_at timestamptz,
  processed_at timestamptz,
  last_error text,
  received_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists whatsapp_webhook_events_queue_idx
  on public.whatsapp_webhook_events (status, next_attempt_at, received_at)
  where status in ('pending', 'processing');

create or replace function public.set_updated_at_v12()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists financial_imports_updated_at_v12 on public.financial_imports;
create trigger financial_imports_updated_at_v12
before update on public.financial_imports
for each row execute function public.set_updated_at_v12();

drop trigger if exists financial_import_rows_updated_at_v12 on public.financial_import_rows;
create trigger financial_import_rows_updated_at_v12
before update on public.financial_import_rows
for each row execute function public.set_updated_at_v12();

drop trigger if exists whatsapp_contacts_updated_at_v12 on public.whatsapp_contacts;
create trigger whatsapp_contacts_updated_at_v12
before update on public.whatsapp_contacts
for each row execute function public.set_updated_at_v12();

drop trigger if exists whatsapp_webhook_events_updated_at_v12 on public.whatsapp_webhook_events;
create trigger whatsapp_webhook_events_updated_at_v12
before update on public.whatsapp_webhook_events
for each row execute function public.set_updated_at_v12();

alter table public.financial_imports enable row level security;
alter table public.financial_import_rows enable row level security;
alter table public.whatsapp_contacts enable row level security;
alter table public.whatsapp_link_tokens enable row level security;
alter table public.whatsapp_webhook_events enable row level security;

drop policy if exists "financial imports select v12" on public.financial_imports;
create policy "financial imports select v12"
on public.financial_imports for select to authenticated
using (public.is_household_member_v12(household_id));

drop policy if exists "financial imports insert v12" on public.financial_imports;
create policy "financial imports insert v12"
on public.financial_imports for insert to authenticated
with check (
  created_by = (select auth.uid())
  and public.is_household_member_v12(household_id)
);

drop policy if exists "financial imports update v12" on public.financial_imports;
create policy "financial imports update v12"
on public.financial_imports for update to authenticated
using (public.is_household_member_v12(household_id))
with check (public.is_household_member_v12(household_id));

drop policy if exists "financial import rows select v12" on public.financial_import_rows;
create policy "financial import rows select v12"
on public.financial_import_rows for select to authenticated
using (
  exists (
    select 1 from public.financial_imports fi
    where fi.id = import_id
      and public.is_household_member_v12(fi.household_id)
  )
);

drop policy if exists "financial import rows insert v12" on public.financial_import_rows;
create policy "financial import rows insert v12"
on public.financial_import_rows for insert to authenticated
with check (
  exists (
    select 1 from public.financial_imports fi
    where fi.id = import_id
      and public.is_household_member_v12(fi.household_id)
  )
);

drop policy if exists "financial import rows update v12" on public.financial_import_rows;
create policy "financial import rows update v12"
on public.financial_import_rows for update to authenticated
using (
  exists (
    select 1 from public.financial_imports fi
    where fi.id = import_id
      and public.is_household_member_v12(fi.household_id)
  )
)
with check (
  exists (
    select 1 from public.financial_imports fi
    where fi.id = import_id
      and public.is_household_member_v12(fi.household_id)
  )
);

drop policy if exists "whatsapp contacts own rows v12" on public.whatsapp_contacts;
create policy "whatsapp contacts own rows v12"
on public.whatsapp_contacts for select to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "whatsapp link tokens own select v12" on public.whatsapp_link_tokens;
create policy "whatsapp link tokens own select v12"
on public.whatsapp_link_tokens for select to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "whatsapp link tokens own insert v12" on public.whatsapp_link_tokens;
create policy "whatsapp link tokens own insert v12"
on public.whatsapp_link_tokens for insert to authenticated
with check (
  user_id = (select auth.uid())
  and public.is_household_member_v12(household_id)
);

drop policy if exists "whatsapp link tokens own update v12" on public.whatsapp_link_tokens;

grant select, insert, update on public.financial_imports to authenticated;
grant select, insert, update on public.financial_import_rows to authenticated;
grant select on public.whatsapp_contacts to authenticated;
revoke update on public.whatsapp_link_tokens from authenticated;
grant select, insert on public.whatsapp_link_tokens to authenticated;
grant all on public.financial_imports, public.financial_import_rows,
  public.whatsapp_contacts, public.whatsapp_link_tokens,
  public.whatsapp_webhook_events to service_role;

create or replace function public.claim_whatsapp_webhook_events_v12(batch_size integer default 10)
returns setof public.whatsapp_webhook_events
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  with claimable as (
    select e.id
    from public.whatsapp_webhook_events e
    where (
      e.status = 'pending'
      and e.next_attempt_at <= now()
    ) or (
      e.status = 'processing'
      and e.locked_at < now() - interval '10 minutes'
    )
    order by e.received_at
    for update skip locked
    limit greatest(1, least(coalesce(batch_size, 10), 50))
  )
  update public.whatsapp_webhook_events e
  set status = 'processing',
      attempts = e.attempts + 1,
      locked_at = now(),
      last_error = null
  from claimable c
  where e.id = c.id
  returning e.*;
end;
$$;

revoke all on function public.claim_whatsapp_webhook_events_v12(integer) from public, anon, authenticated;
grant execute on function public.claim_whatsapp_webhook_events_v12(integer) to service_role;

create or replace function public.cleanup_whatsapp_link_tokens_v12()
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_count bigint;
begin
  delete from public.whatsapp_link_tokens
  where expires_at < now() - interval '1 day'
     or consumed_at < now() - interval '7 days';
  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

revoke all on function public.cleanup_whatsapp_link_tokens_v12() from public, anon, authenticated;
grant execute on function public.cleanup_whatsapp_link_tokens_v12() to service_role;

drop policy if exists "financial imports storage read v12" on storage.objects;
create policy "financial imports storage read v12"
on storage.objects for select to authenticated
using (
  bucket_id = 'financial-imports'
  and (storage.foldername(name))[2] = (select auth.uid())::text
  and public.is_household_member_path_v12((storage.foldername(name))[1])
);

drop policy if exists "financial imports storage insert v12" on storage.objects;
create policy "financial imports storage insert v12"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'financial-imports'
  and (storage.foldername(name))[2] = (select auth.uid())::text
  and public.is_household_member_path_v12((storage.foldername(name))[1])
);

drop policy if exists "financial imports storage delete v12" on storage.objects;
create policy "financial imports storage delete v12"
on storage.objects for delete to authenticated
using (
  bucket_id = 'financial-imports'
  and (storage.foldername(name))[2] = (select auth.uid())::text
  and public.is_household_member_path_v12((storage.foldername(name))[1])
);

commit;
