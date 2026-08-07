# AUREUM

Base inicial do aplicativo web de organização financeira para pessoas e casais.

## O que já existe

- Next.js com App Router e TypeScript.
- Landing page responsiva.
- Dashboard demonstrativo responsivo.
- Rota de verificação em `/api/health`.
- Arquivo de variáveis de ambiente para a futura conexão com Supabase, Google Sheets e WhatsApp.
- Estrutura pronta para deploy na Vercel.

> Os valores exibidos no dashboard são fictícios. Esta primeira entrega valida a base visual e o processo de publicação.

## Executar localmente

Requisitos: Node.js 22 ou superior.

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

Também teste:

```text
http://localhost:3000/dashboard
http://localhost:3000/api/health
```

## Publicar no GitHub

Crie um repositório vazio chamado `aureum` no GitHub. Depois, dentro desta pasta:

```bash
git init
git add .
git commit -m "feat: cria fundação do AUREUM"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/aureum.git
git push -u origin main
```

## Publicar na Vercel

1. Entre na Vercel usando sua conta do GitHub.
2. Selecione **Add New → Project**.
3. Importe o repositório `aureum`.
4. Confirme que o framework foi identificado como **Next.js**.
5. Mantenha o diretório raiz como `./`.
6. Não adicione variáveis de ambiente nesta primeira publicação.
7. Clique em **Deploy**.
8. Depois do deploy, teste `/`, `/dashboard` e `/api/health`.

A Vercel passará a publicar automaticamente cada novo `push` feito na branch `main`.

## Próxima etapa

Conectar o Supabase para implementar:

1. autenticação;
2. perfil do usuário;
3. organização familiar;
4. contas bancárias;
5. cartões;
6. transações;
7. políticas de segurança RLS.

## Variáveis futuras

Copie `.env.example` para `.env.local` somente quando criarmos o projeto Supabase:

```bash
cp .env.example .env.local
```

Nunca envie `.env.local` ou chaves secretas para o GitHub.
