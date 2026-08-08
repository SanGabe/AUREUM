# AUREUM — Product Pages + Real Database v1

Este overlay faz quatro mudanças grandes de uma vez:

1. cria páginas dedicadas da landing;
2. atualiza cadastro, login e onboarding para a identidade AUREUM;
3. permite no onboarding CRIAR uma Household OU ENTRAR por código;
4. remove dados fictícios de `/dashboard` e passa a calcular o dashboard pelo Supabase.

## Páginas novas

- `/recursos`
- `/para-quem`
- `/seguranca`
- `/sobre-nos`
- `/amor`
- `/ordo`
- `/progressus`

A rota `/demonstracao` continua sendo explicitamente uma demonstração e, por isso,
é a única que usa números de exemplo.

## Onboarding

Novo fluxo:

Conta confirmada
→ `/onboarding`
→ escolher:
  - Criar Household
  - Já faço parte de uma Household
→ código `AUR-XXXXXXXX`
→ solicitação `pending`
→ owner/admin aprova
→ usuário entra inicialmente como `viewer` / Membro

O código não concede acesso sozinho.

## Dashboard real

`/dashboard` não contém mais:

- salário fictício;
- Mercado São Luiz fictício;
- Steam fictício;
- meta Portugal fictícia;
- categorias e totais fixos.

O servidor consulta:

- `accounts`
- `cards`
- `transactions`
- `categories`
- `goals`

e usa RPCs PostgreSQL para os totais.

Quando não houver dados, o dashboard mostra zero e empty states.

## Banco — execute primeiro

No Supabase SQL Editor execute:

`SQL_FINANCIAL_CORE_REAL_DASHBOARD.sql`

Ele cria:
- accounts
- cards
- categories
- transactions
- goals
- financial_submissions
- RLS
- categorias padrão de configuração
- funções reais do dashboard

Ele NÃO cria transações, contas, cartões, metas ou valores fictícios.

## Depois aplique os arquivos

Extraia o ZIP na raiz do projeto e substitua os arquivos existentes.

No PowerShell:

```powershell
npm.cmd run typecheck
npm.cmd run build
```

Depois:

```powershell
git add .
git commit -m "feat: add product pages household join onboarding and real dashboard"
git push
```

## Ararinha do footer

`public/brand/aureum-footer-bird.svg`

é vetor e transparente. Portanto pode ser exibida grande sem pixelar.

## Importante

A estrutura assume que as migrations anteriores de Household já existem,
incluindo as funções privadas:

- `private.is_household_member`
- `private.can_manage_household`
- `private.can_submit_financial`
- `private.can_commit_financial`
