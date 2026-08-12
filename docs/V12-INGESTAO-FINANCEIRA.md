# V12 — ingestão financeira e WhatsApp

## O que entra nesta versão

- staging seguro para extratos, faturas e documentos financeiros;
- bucket privado `financial-imports` com limite de 20 MB;
- upload autenticado pela web em `POST /api/imports`;
- associação do WhatsApp por código temporário em `POST /api/whatsapp/link`;
- webhook da Meta em `GET/POST /api/whatsapp/webhook`;
- validação HMAC SHA-256 do corpo bruto do webhook;
- worker assíncrono em `POST /api/internal/imports/process`;
- detecção de arquivo repetido por SHA-256;
- parser genérico inicial para CSV e TXT;
- PDF, OFX, XLSX e imagens preservados como `awaiting_parser`;
- staging de lançamentos em `financial_import_rows`, sem gravá-los diretamente em `transactions`;
- jobs de importação, câmbio e limpeza preparados em SQL manual.

## Ordem de ativação

1. Preencha as novas variáveis de ambiente usando `.env.example`.
2. Aplique `supabase/migrations/202608110001_financial_ingestion_v12.sql`.
3. Configure o bucket com:

   ```powershell
   node --env-file=.env.local .\scripts\setup-financial-imports.mjs
   ```

4. Publique a aplicação e configure na Meta o webhook `/api/whatsapp/webhook`.
5. Valide manualmente upload, associação por código e recebimento de uma mídia.
6. Somente depois execute `supabase/manual/financial_ingestion_jobs_v12.sql`.

## Variáveis novas

```text
WHATSAPP_APP_SECRET
WHATSAPP_VERIFY_TOKEN
WHATSAPP_ACCESS_TOKEN
WHATSAPP_PHONE_NUMBER_ID
WHATSAPP_GRAPH_VERSION
WHATSAPP_LINK_TOKEN_SECRET
IMPORT_WORKER_SECRET
```

`WHATSAPP_LINK_TOKEN_SECRET` e `IMPORT_WORKER_SECRET` devem ser valores aleatórios diferentes e longos.

## Formato do upload web

Envie `multipart/form-data` com:

```text
file          arquivo financeiro
householdId   UUID do núcleo financeiro
currency      moeda ISO de três letras; padrão BRL
```

## Estados importantes

```text
queued
awaiting_parser
ready_for_review
duplicate
failed
completed
```

Nenhuma linha importada vira transação oficial automaticamente. A V13 adiciona a interface em `/importacoes` e `/{locale}/imports`: a pessoa revisa os campos antes de aprovar. A função `review_financial_import_row_v13` cria no máximo uma transação por linha e registra quem revisou.

## Complemento V13 — revisão web

- migração `supabase/migrations/202608120001_financial_import_review_v13.sql`;
- rota `PATCH /api/imports/[importId]/rows/[rowId]`;
- listagem de documentos por Núcleo;
- correção e rejeição de linhas;
- aprovação atômica e idempotente;
- vínculo entre a linha e a transação criada.

A migração V13 deve ser aplicada depois da V12. A interface remota depende das duas migrações e do bucket privado.

## Organização do repositório

Os backups produzidos pelos aplicadores V6–V11 foram preservados em `archive/legacy-patches/backups`, mantendo os caminhos relativos. Arquivos auxiliares que estavam soltos na raiz foram movidos para `archive/legacy-patches/root-assets`. A pasta `archive` está excluída do TypeScript.
