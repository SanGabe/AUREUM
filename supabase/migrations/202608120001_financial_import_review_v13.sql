-- V13: revisão e aprovação idempotente das linhas importadas.

alter table public.financial_import_rows
  add column if not exists official_transaction_id uuid references public.transactions(id) on delete set null,
  add column if not exists reviewed_by uuid references auth.users(id) on delete set null,
  add column if not exists reviewed_at timestamptz;

create index if not exists financial_import_rows_official_transaction_idx
  on public.financial_import_rows (official_transaction_id)
  where official_transaction_id is not null;

create or replace function public.review_financial_import_row_v13(
  target_row_id uuid,
  target_action text,
  target_occurred_on date default null,
  target_description text default null,
  target_amount numeric default null,
  target_type text default null,
  target_category_id uuid default null,
  target_account_id uuid default null,
  target_card_id uuid default null
)
returns table (row_id uuid, review_status text, transaction_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  source_row public.financial_import_rows%rowtype;
  source_import public.financial_imports%rowtype;
  membership_role text;
  created_transaction uuid;
begin
  if target_action not in ('approve', 'reject', 'needs_review') then
    raise exception 'invalid_review_action';
  end if;

  select * into source_row
  from public.financial_import_rows
  where id = target_row_id
  for update;

  if source_row.id is null then raise exception 'import_row_not_found'; end if;

  select * into source_import from public.financial_imports where id = source_row.import_id;
  select role::text into membership_role
  from public.household_members
  where household_id = source_import.household_id and user_id = auth.uid();

  if membership_role not in ('owner', 'admin') then raise exception 'import_review_forbidden'; end if;

  if target_action = 'approve' then
    if source_row.official_transaction_id is not null then
      return query select source_row.id, source_row.review_status, source_row.official_transaction_id;
      return;
    end if;

    if coalesce(target_description, source_row.description, '') = ''
      or coalesce(target_amount, source_row.amount) is null
      or coalesce(target_occurred_on, source_row.occurred_on) is null then
      raise exception 'import_row_incomplete';
    end if;

    insert into public.transactions (
      household_id, created_by, description, type, amount, currency,
      occurred_at, category_id, account_id, card_id, reimbursable, origin, status
    ) values (
      source_import.household_id,
      auth.uid(),
      coalesce(target_description, source_row.description),
      case when coalesce(target_type, source_row.proposed_type) in ('income', 'expense', 'transfer') then coalesce(target_type, source_row.proposed_type) else 'expense' end,
      abs(coalesce(target_amount, source_row.amount)),
      source_row.currency,
      coalesce(target_occurred_on, source_row.occurred_on)::timestamptz,
      target_category_id,
      target_account_id,
      target_card_id,
      false,
      'IMPORT',
      'posted'
    ) returning id into created_transaction;

    update public.financial_import_rows set
      occurred_on = coalesce(target_occurred_on, occurred_on),
      description = coalesce(nullif(target_description, ''), description),
      amount = coalesce(target_amount, amount),
      proposed_type = coalesce(target_type, proposed_type),
      proposed_category_id = target_category_id,
      proposed_account_id = target_account_id,
      proposed_card_id = target_card_id,
      review_status = 'approved', official_transaction_id = created_transaction,
      reviewed_by = auth.uid(), reviewed_at = now()
    where id = target_row_id;
  else
    update public.financial_import_rows set
      review_status = case when target_action = 'reject' then 'rejected' else 'needs_review' end,
      reviewed_by = auth.uid(), reviewed_at = now()
    where id = target_row_id;
  end if;

  update public.financial_imports fi set
    status = case
      when not exists (select 1 from public.financial_import_rows r where r.import_id = fi.id and r.review_status in ('pending', 'needs_review')) then 'completed'
      else fi.status
    end,
    updated_at = now()
  where fi.id = source_import.id;

  return query select r.id, r.review_status, r.official_transaction_id
  from public.financial_import_rows r where r.id = target_row_id;
end;
$$;

revoke all on function public.review_financial_import_row_v13(uuid,text,date,text,numeric,text,uuid,uuid,uuid) from public, anon;
grant execute on function public.review_financial_import_row_v13(uuid,text,date,text,numeric,text,uuid,uuid,uuid) to authenticated, service_role;
