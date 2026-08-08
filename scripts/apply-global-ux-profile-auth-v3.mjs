import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const MARKER = "/* AUREUM PROFILE AUTH V3 */";

function p(rel) {
  return path.join(ROOT, rel);
}

function exists(rel) {
  return fs.existsSync(p(rel));
}

function read(rel) {
  return fs
    .readFileSync(p(rel), "utf8")
    .replace(/\r\n/g, "\n");
}

function write(rel, content) {
  fs.writeFileSync(p(rel), content, "utf8");
}

function appendOnce(rel, block) {
  if (!exists(rel)) return;

  let content = read(rel);

  if (content.includes(MARKER)) {
    console.log(`Já ajustado: ${rel}`);
    return;
  }

  content = `${content.trim()}\n\n${MARKER}\n${block.trim()}\n`;
  write(rel, content);
  console.log(`V3 CSS: ${rel}`);
}

function runPreviousLayer() {
  const script = p(
    "scripts/apply-global-ux-demo-v2.mjs",
  );

  if (!fs.existsSync(script)) {
    throw new Error(
      "scripts/apply-global-ux-demo-v2.mjs não encontrado.",
    );
  }

  const result = spawnSync(
    process.execPath,
    [script],
    {
      cwd: ROOT,
      stdio: "inherit",
    },
  );

  if (result.status !== 0) {
    throw new Error(
      "Falha ao aplicar a camada Global UX V2.",
    );
  }
}

function patchBothLabel() {
  const rel = "src/components/finance-forms.tsx";
  if (!exists(rel)) return;

  let content = read(rel);

  content = content
    .replaceAll(
      'locale === "pt-BR" ? "Receita e despesa" : "Income and expense"',
      'locale === "pt-BR" ? "Ambos" : "Both"',
    )
    .replaceAll(
      'locale === "pt-BR" ? "Ambos" : "Income and expense"',
      'locale === "pt-BR" ? "Ambos" : "Both"',
    );

  write(rel, content);
  console.log(
    "Rótulo both corrigido: Despesa / Receita / Ambos.",
  );
}


function patchProfileAvatar() {
  const rel =
    "src/components/dashboard-controls.tsx";

  if (!exists(rel)) return;

  let content = read(rel);

  if (
    !content.includes(
      "@/components/account-avatar",
    )
  ) {
    const anchor =
      'import { ThemeSelect } from "@/components/theme-selector";';

    if (content.includes(anchor)) {
      content = content.replace(
        anchor,
        `${anchor}\nimport { AccountAvatar } from "@/components/account-avatar";`,
      );
    }
  }

  content = content.replace(
    '<span>{initials(userName)}</span>',
    '<AccountAvatar name={userName} />',
  );

  content = content.replace(
    '<span className={styles.profileAvatar}>{initials(userName)}</span>',
    '<AccountAvatar className={styles.profileAvatar} name={userName} />',
  );

  write(rel, content);

  console.log(
    "Foto de perfil integrada ao menu do usuário.",
  );
}

function appendEnvExample() {
  const rel = ".env.example";
  if (!exists(rel)) return;

  let content = read(rel);

  const block = `
# Identity verification (optional until SERPRO is contracted)
# local = checksum only
# serpro = official Receita Federal source through SERPRO
IDENTITY_PROVIDER=local

# When IDENTITY_PROVIDER=serpro, keep true in production
# to block registration if the official check cannot be confirmed.
IDENTITY_REQUIRE_OFFICIAL=true

# Server-only SERPRO credentials. NEVER prefix with NEXT_PUBLIC_.
SERPRO_CONSUMER_KEY=
SERPRO_CONSUMER_SECRET=

# Official defaults are already built into the code.
# Override only if SERPRO changes your contracted endpoint.
# SERPRO_CPF_URL_TEMPLATE=https://gateway.apiserpro.serpro.gov.br/consulta-cpf-df/v3/cpf/{cpf}/{birthDateCompact}
# SERPRO_CNPJ_URL_TEMPLATE=https://gateway.apiserpro.serpro.gov.br/consulta-cnpj-df/v2/basica/{cnpj}

# Protect billable registry lookups from abuse.
IDENTITY_RATE_LIMIT_SECRET=
IDENTITY_PER_10_MINUTE_LIMIT=5
IDENTITY_DAILY_LIMIT=100
`.trim();

  if (!content.includes("IDENTITY_PROVIDER=")) {
    content = `${content.trim()}\n\n${block}\n`;
    write(rel, content);
    console.log(".env.example atualizado.");
  }
}

runPreviousLayer();
patchBothLabel();
patchProfileAvatar();
appendEnvExample();

appendOnce(
  "src/components/auth.module.css",
  `
.signupShell {
  grid-template-columns:
    minmax(340px,.92fr)
    minmax(620px,800px);
}

.signupCard {
  width: min(100%,720px);
}

.signupShell .formPanel {
  padding-inline: clamp(24px,3vw,48px);
}

@media(max-width:1100px) and (min-width:901px) {
  .signupShell {
    grid-template-columns:
      minmax(300px,.72fr)
      minmax(590px,1fr);
  }

  .signupShell .brandPanel {
    padding-inline: 28px;
  }

  .signupShell .brandCopy h2 {
    font-size: clamp(2.35rem,4.5vw,3.8rem);
  }
}

@media(max-width:900px) {
  .signupShell {
    grid-template-columns: 1fr;
  }

  .signupCard {
    width: min(100%,680px);
  }
}
`,
);


appendOnce(
  "src/components/dashboard-view.module.css",
  `
.profileMenuIdentity > span,
.profileAvatar {
  overflow: hidden;
}

.profileMenuIdentity > span img,
.profileAvatar img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}
`,
);

appendOnce(
  "src/components/account-page.module.css",
  `
.content {
  width: min(calc(100% - 32px),1040px);
}

.card {
  padding: clamp(18px,2.4vw,28px);
}

.form label {
  color: var(--a-muted);
  font-size: 11px;
}

.form input,
.form select,
.form textarea {
  min-height: 44px;
  padding: 9px 11px;
  color: var(--a-control-text);
  border: 1px solid var(--a-control-border);
  border-radius: 8px;
  background: var(--a-control-bg);
  font: inherit;
  font-size: 12px;
}

.form select option,
.form select optgroup {
  color: var(--a-option-text);
  background: var(--a-option-bg);
}

.form button[type="submit"] {
  min-height: 44px;
  padding-inline: 16px;
  font-size: 11px;
}

@media(max-width:720px) {
  .content {
    width: calc(100% - 24px);
  }

  .card {
    padding: 16px;
  }
}
`,
);

console.log("");
console.log(
  "AUREUM Global UX + Profile/Auth V3 aplicado.",
);
console.log("Agora:");
console.log(
  "1. Execute SQL_PROFILE_AUTH_IDENTITY_V6.sql no Supabase.",
);
console.log("2. Rode npm.cmd run typecheck");
console.log("3. Rode npm.cmd run build");
