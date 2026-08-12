-- Execute somente após publicar a aplicação, configurar os segredos e validar a V12.
-- Este arquivo é deliberadamente manual: URLs e segredos variam por ambiente.

create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;
create extension if not exists supabase_vault with schema vault;

-- Crie estes segredos uma única vez e substitua os valores de exemplo:
-- select vault.create_secret('https://SEU-DOMINIO', 'aureum_app_url');
-- select vault.create_secret('SEU_IMPORT_WORKER_SECRET', 'aureum_import_worker_secret');
-- select vault.create_secret('SEU_FX_SYNC_SECRET', 'aureum_fx_sync_secret');

select cron.unschedule(jobid)
from cron.job
where jobname in ('aureum-import-worker-v12', 'aureum-fx-sync-v12', 'aureum-whatsapp-token-cleanup-v12');

select cron.schedule(
  'aureum-import-worker-v12',
  '* * * * *',
  $$
    select net.http_post(
      url := (select decrypted_secret from vault.decrypted_secrets where name = 'aureum_app_url')
        || '/api/internal/imports/process',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'x-aureum-worker-secret',
        (select decrypted_secret from vault.decrypted_secrets where name = 'aureum_import_worker_secret')
      ),
      body := '{}'::jsonb,
      timeout_milliseconds := 50000
    );
  $$
);

select cron.schedule(
  'aureum-fx-sync-v12',
  '7 * * * *',
  $$
    select net.http_post(
      url := (select decrypted_secret from vault.decrypted_secrets where name = 'aureum_app_url')
        || '/api/internal/exchange-rates/sync',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'x-aureum-cron-secret',
        (select decrypted_secret from vault.decrypted_secrets where name = 'aureum_fx_sync_secret')
      ),
      body := '{}'::jsonb,
      timeout_milliseconds := 50000
    );
  $$
);

select cron.schedule(
  'aureum-whatsapp-token-cleanup-v12',
  '25 3 * * *',
  $$ select public.cleanup_whatsapp_link_tokens_v12(); $$
);
