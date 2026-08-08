# AUREUM — Landing fiel ao mockup v2

Este pacote **não usa uma screenshot da página como fundo** e não substitui a landing
por uma imagem.

A página foi refeita em React/Next.js + CSS Module e usa os assets enviados pelo
próprio projeto.

## O que mudou

- navbar e proporções alinhadas ao mockup aprovado;
- logo real AUREUM no header;
- hero "Saia da idade da pedra das finanças pessoais.";
- celular e notebook continuam sendo HTML/CSS/SVG responsivos;
- ararinha do hero usa o asset da identidade;
- pedra real enviada por você;
- AMOR usa o coração real;
- ORDO usa a pilastra real;
- PROGRESSUS usa os louros reais;
- selo institucional existente continua na história;
- CTA usa o emblema circular da ararinha;
- footer usa o logo + lema;
- favicon passa a usar o emblema AUREUM;
- layout desktop e mobile responsivos.

## Assets adicionados

`public/brand/`

- `aureum-logo-hq.png`
- `aureum-logo-motto-hq.png`
- `aureum-emblem-hq.png`
- `aureum-stone-hq.png`
- `aureum-heart-hq.png`
- `aureum-column-hq.png`
- `aureum-laurel-hq.png`

Os arquivos foram apenas recortados nas margens transparentes para uso web.
A arte não foi regenerada.

## Arquivos de código

Substituir:

- `src/app/page.tsx`
- `src/app/landing.module.css`
- `src/app/layout.tsx`

## Aplicação

Extraia este ZIP na raiz do repositório AUREUM e permita substituir os arquivos.

No PowerShell:

```powershell
npm.cmd run typecheck
npm.cmd run build
```

Se passar:

```powershell
git add .
git commit -m "feat: match approved AUREUM landing with brand assets"
git push
```

## Observação importante

O arquivo já existente abaixo é utilizado e NÃO precisa ser substituído:

`public/brand/aureum-seal.png`

Ele é o selo institucional que aparece em "Nossa história".
