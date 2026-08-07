# Aplicar a autenticação Supabase no AUREUM

Este pacote é um **overlay**: copie o conteúdo dele por cima da raiz do repositório `aureum`.

O rebranding aqui é apenas estrutural. Cores, tipografia e layout foram mantidos para receber a identidade visual definitiva depois. O favicon/monograma com “A” é temporário.

## Windows PowerShell

Na pasta do seu repositório local:

```powershell
# 1. Copie os arquivos deste overlay para a raiz do projeto, preservando as pastas.
# 2. Instale as novas dependências:
npm install

# 3. Valide:
npm run typecheck
npm run build

# 4. Versione:
git add .
git commit -m "feat: adiciona autenticação com Supabase"
git push origin main
```

A Vercel fará o deploy automaticamente depois do `push`.

## Rotas adicionadas

- `/entrar`
- `/cadastrar`
- `/auth/callback`
- `/dashboard` (protegido)
- `/demonstracao` (público)

## Variáveis esperadas

A integração Vercel + Supabase já deve fornecer:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

O código também aceita `NEXT_PUBLIC_SUPABASE_ANON_KEY` como fallback legado.

## Configuração necessária no Supabase

Em **Authentication > URL Configuration** configure:

- Site URL: `https://SEU-DOMINIO.vercel.app`
- Redirect URL: `https://SEU-DOMINIO.vercel.app/auth/callback`

Se o domínio da Vercel mudar, atualize essas URLs.
