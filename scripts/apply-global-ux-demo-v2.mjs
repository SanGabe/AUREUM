import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const GLOBAL_MARKER = "/* AUREUM GLOBAL UX DEMO V2 */";

function p(rel) {
  return path.join(ROOT, rel);
}

function read(rel) {
  return fs.readFileSync(p(rel), "utf8").replace(/\r\n/g, "\n");
}

function write(rel, content) {
  fs.writeFileSync(p(rel), content, "utf8");
}

function exists(rel) {
  return fs.existsSync(p(rel));
}

function replaceAll(content, pairs) {
  let out = content;
  for (const [from, to] of pairs) {
    out = out.split(from).join(to);
  }
  return out;
}

function appendOnce(rel, block) {
  if (!exists(rel)) return;
  let content = read(rel);
  if (content.includes(GLOBAL_MARKER)) {
    console.log(`Já ajustado: ${rel}`);
    return;
  }
  content = `${content.trim()}\n\n${GLOBAL_MARKER}\n${block.trim()}\n`;
  write(rel, content);
  console.log(`UX: ${rel}`);
}

function ensureThemeImport() {
  const rel = "src/app/layout.tsx";
  if (!exists(rel)) return;
  let content = read(rel);

  if (!content.includes('"./theme.css"')) {
    const anchor = 'import "./globals.css";';
    if (content.includes(anchor)) {
      content = content.replace(
        anchor,
        `${anchor}\nimport "./theme.css";`,
      );
      write(rel, content);
      console.log("Import theme.css adicionado.");
    }
  }
}

function runAnalyticsIfNeeded() {
  const rel = "src/components/dashboard-view.tsx";
  if (!exists(rel)) return;

  const content = read(rel);

  if (
    content.includes("@/components/dashboard-analytics") &&
    content.includes("analytics?: DashboardAnalyticsData")
  ) {
    console.log("Analytics já presente; etapa cumulativa ignorada.");
    return;
  }

  const script = p("scripts/apply-analytics-v1.mjs");

  if (!fs.existsSync(script)) {
    throw new Error(
      "Analytics ainda não está aplicado e scripts/apply-analytics-v1.mjs não foi encontrado.",
    );
  }

  console.log("Aplicando camada Analytics anterior...");
  const result = spawnSync(
    process.execPath,
    [script],
    {
      cwd: ROOT,
      stdio: "inherit",
    },
  );

  if (result.status !== 0) {
    throw new Error("Falha ao aplicar camada Analytics.");
  }
}

function normalizeAllCssModules() {
  const root = p("src");
  const files = [];

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, {
      withFileTypes: true,
    })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (
        entry.isFile() &&
        entry.name.endsWith(".module.css")
      ) {
        files.push(full);
      }
    }
  }

  walk(root);

  const pairs = [
    ["#000e22", "var(--a-page-bg)"],
    ["#00142f", "var(--a-page-bg-2)"],
    ["#031a35", "var(--a-sidebar-1)"],
    ["#001126", "var(--a-sidebar-2)"],
    ["#061b35", "var(--a-elevated)"],
    ["#061a35", "var(--a-control-bg)"],
    ["#041a34", "var(--a-surface-2)"],
    ["#04152c", "var(--a-input)"],
    ["#04162e", "var(--a-surface-3)"],
    ["#03152d", "var(--a-surface-3)"],
    ["#03152c", "var(--a-surface-3)"],
    ["#061f3e", "var(--a-surface-2)"],
    ["#03172f", "var(--a-surface)"],
    ["#06142d", "var(--a-sidebar-2)"],
    ["#061830", "var(--a-surface)"],
    ["#051a35", "var(--a-surface)"],
    ["#071b3e", "var(--a-page-bg-2)"],
    ["#06152f", "var(--a-page-bg)"],
    ["#07152d", "var(--a-page-bg-2)"],

    ["#e7ecf4", "var(--a-text)"],
    ["#e8edf3", "var(--a-text)"],
    ["#e9edf3", "var(--a-text)"],
    ["#edf0f4", "var(--a-text)"],
    ["#f0ece5", "var(--a-heading)"],
    ["#f1ece2", "var(--a-heading)"],
    ["#f2ece1", "var(--a-heading)"],
    ["#f3eee4", "var(--a-heading)"],
    ["#f4eee3", "var(--a-heading)"],
    ["#f5eee1", "var(--a-heading)"],
    ["#bcc7d5", "var(--a-text)"],
    ["#bdc8d5", "var(--a-text)"],
    ["#d7e0ea", "var(--a-text)"],

    ["#91a2b9", "var(--a-muted)"],
    ["#91a3ba", "var(--a-muted)"],
    ["#899ab1", "var(--a-muted)"],
    ["#8fa0b6", "var(--a-muted)"],
    ["#8fa1b8", "var(--a-muted)"],
    ["#7f91a9", "var(--a-muted)"],
    ["#7e91aa", "var(--a-muted)"],
    ["#7e91a8", "var(--a-muted)"],
    ["#8193a9", "var(--a-muted)"],
    ["#8395ad", "var(--a-muted)"],
    ["#8294ad", "var(--a-muted)"],
    ["#7f90a7", "var(--a-muted)"],
    ["#7589a3", "var(--a-muted)"],
    ["#7387a0", "var(--a-muted)"],
    ["#72879f", "var(--a-muted)"],
    ["#71859f", "var(--a-muted-2)"],
    ["#71849e", "var(--a-muted-2)"],
    ["#70849e", "var(--a-muted-2)"],
    ["#70839d", "var(--a-muted-2)"],
    ["#70859e", "var(--a-muted-2)"],
    ["#687d99", "var(--a-muted-2)"],
    ["#6e829d", "var(--a-muted-2)"],
    ["#a99772", "var(--a-muted)"],

    ["#e4aa32", "var(--a-gold)"],
    ["#dca833", "var(--a-gold)"],
    ["#dba833", "var(--a-gold)"],
    ["#dba632", "var(--a-gold)"],
    ["#d9a12d", "var(--a-gold)"],
    ["#e7ad35", "var(--a-gold)"],
    ["#dba536", "var(--a-gold)"],
    ["#e1a632", "var(--a-gold)"],
    ["#efba4b", "var(--a-gold-strong)"],
    ["#efbd4d", "var(--a-gold-strong)"],
    ["#f0c15b", "var(--a-gold-strong)"],
    ["#efc15b", "var(--a-gold-strong)"],
    ["#efc15d", "var(--a-gold-strong)"],
    ["#d8b45a", "var(--a-gold-strong)"],
    ["#d8ad4e", "var(--a-gold-strong)"],
    ["#cfaa58", "var(--a-gold-strong)"],
    ["#c9a54e", "var(--a-gold-strong)"],
    ["#cbb26d", "var(--a-gold-strong)"],
    ["#e5b247", "var(--a-gold-strong)"],

    ["#55d39f", "var(--a-success)"],
    ["#5bd6a4", "var(--a-success)"],
    ["#42d3a1", "var(--a-success)"],
    ["#57d7ac", "var(--a-success)"],
    ["#ed7770", "var(--a-danger)"],
    ["#dc8580", "var(--a-danger)"],
    ["#ff7070", "var(--a-danger)"],
    ["#ff8d8d", "var(--a-danger)"],

    ["rgba(255,255,255,.07)", "var(--a-border-soft)"],
    ["rgba(255,255,255,.065)", "var(--a-border-soft)"],
    ["rgba(255,255,255,.055)", "var(--a-border-soft)"],
    ["rgba(255,255,255,.045)", "var(--a-border-soft)"],
    ["rgba(228,170,50,.27)", "var(--a-border)"],
    ["rgba(228,170,50,.25)", "var(--a-border)"],
    ["rgba(228,170,50,.22)", "var(--a-border)"],
    ["rgba(228,170,50,.20)", "var(--a-border)"],
    ["rgba(228,170,50,.2)", "var(--a-border)"],
    ["rgba(228,170,50,.19)", "var(--a-border)"],
    ["rgba(228,170,50,.18)", "var(--a-border)"],
    ["rgba(228,170,50,.17)", "var(--a-border)"],
    ["rgba(228,170,50,.16)", "var(--a-border)"],
    ["rgba(228,170,50,.15)", "var(--a-border)"],
    ["rgba(228,170,50,.14)", "var(--a-border)"],
    ["rgba(228,170,50,.13)", "var(--a-border)"],
    ["rgba(228,170,50,.12)", "var(--a-border)"],
    ["rgba(228,170,50,.06)", "var(--a-gold-soft)"],
    ["rgba(228,170,50,.055)", "var(--a-gold-soft)"],
    ["rgba(228,170,50,.04)", "var(--a-gold-soft)"],
    ["rgba(228,170,50,.035)", "var(--a-gold-soft)"],
  ];

  for (const full of files) {
    const before = fs
      .readFileSync(full, "utf8")
      .replace(/\r\n/g, "\n");

    const after = replaceAll(before, pairs);

    if (before !== after) {
      fs.writeFileSync(full, after, "utf8");
      console.log(
        `Tema global: ${path.relative(ROOT, full)}`,
      );
    }
  }
}

ensureThemeImport();
runAnalyticsIfNeeded();
normalizeAllCssModules();

appendOnce(
  "src/components/dashboard-view.module.css",
  `
.shell {
  grid-template-columns: 248px minmax(0,1fr);
  color: var(--a-text);
  background: var(--a-page-bg);
}

.sidebar {
  padding: 24px 18px 18px;
  border-color: var(--a-border);
  background: linear-gradient(180deg,var(--a-sidebar-1),var(--a-sidebar-2));
}

.brand {
  width: 188px;
  height: 72px;
  margin-bottom: 30px;
}

.sidebarNav {
  gap: 6px;
}

.sidebarNav a {
  min-height: 44px;
  gap: 10px;
  padding: 0 12px;
  color: var(--a-muted);
  font-size: 12px;
}

.sidebarNav a:hover,
.sidebarNav .activeLink {
  color: var(--a-gold-strong);
  background: var(--a-gold-soft);
}

.content {
  width: min(100%,1560px);
  margin: 0 auto;
  padding: 38px clamp(28px,3.6vw,58px) 64px;
}

.profileButton,
.profileMenu {
  color: var(--a-text);
}

.profileMenu {
  overflow: visible;
  border-color: var(--a-border);
  background: var(--a-elevated);
  box-shadow: var(--a-shadow);
}

.profileNucleus > span {
  color: var(--a-gold);
  font-size: 9px;
}

.profileNucleus select {
  min-height: 42px;
  padding: 0 11px;
  color: var(--a-control-text);
  border-color: var(--a-control-border);
  background: var(--a-control-bg);
  font-size: 11px;
}

.profileNucleus option,
.profileNucleus optgroup {
  color: var(--a-option-text);
  background: var(--a-option-bg);
}

.profileLinks strong {
  font-size: 11px;
}

.profileLinks small {
  color: var(--a-muted-2);
  font-size: 9px;
}

.top {
  margin-bottom: 20px;
}

.top h1 {
  font-size: clamp(3rem,4.8vw,4.6rem);
}

.top p:not(.eyebrow) {
  max-width: 780px;
  color: var(--a-muted);
  font-size: 13px;
  line-height: 1.55;
}

.eyebrow {
  color: var(--a-gold);
  font-size: 10px;
}

.periodLabel {
  color: var(--a-muted-2);
  font-size: 9px;
}

.monthControl {
  grid-template-columns: 40px minmax(210px,auto) 40px;
}

.monthArrow,
.monthMain {
  min-height: 44px;
  color: var(--a-control-text);
  border-color: var(--a-control-border);
  background: var(--a-control-bg);
}

.monthMain strong {
  font-size: 11px;
}

.monthPopover {
  width: 330px;
  color: var(--a-text);
  border-color: var(--a-border);
  background: var(--a-elevated);
  box-shadow: var(--a-shadow);
}

.monthPopoverHeader button,
.monthGrid button {
  color: var(--a-text);
  border-color: var(--a-border-soft);
  background: var(--a-surface-2);
}

.summary {
  gap: 12px;
}

.summary article {
  min-height: 128px;
  padding: 18px;
  color: var(--a-text);
  border-color: var(--a-border);
  background: var(--a-card-gradient);
}

.summary span {
  color: var(--a-muted);
  font-size: 11px;
}

.summary strong {
  font-size: clamp(1.45rem,2vw,2rem);
}

.summary small {
  color: var(--a-muted-2);
  font-size: 9px;
}

.panel {
  color: var(--a-text);
  border-color: var(--a-border);
  background: var(--a-surface);
  box-shadow: var(--a-shadow);
}

.panelHead p {
  color: var(--a-gold);
  font-size: 9px;
}

.panelHead h2 {
  color: var(--a-heading);
  font-size: 20px;
}

.transaction strong,
.category strong {
  font-size: 11px;
}

.transaction small,
.category span {
  font-size: 9px;
}

@media(min-width:1600px) {
  .shell {
    grid-template-columns: 260px minmax(0,1fr);
  }

  .content {
    width: min(100%,1640px);
    padding-inline: clamp(42px,4vw,74px);
  }
}

@media(max-width:1180px) {
  .shell {
    grid-template-columns: 220px minmax(0,1fr);
  }

  .sidebar {
    padding-inline: 14px;
  }

  .brand {
    width: 170px;
  }

  .content {
    padding-inline: 24px;
  }
}

@media(max-width:1024px) {
  .shell {
    display: block;
  }

  .sidebar {
    display: none;
  }

  .content {
    width: 100%;
    padding: 28px 20px 112px;
  }
}

@media(max-width:700px) {
  .content {
    padding: 20px 12px 108px;
  }

  .top h1 {
    font-size: clamp(2.3rem,12vw,3.5rem);
  }
}
`,
);

appendOnce(
  "src/components/finance-page.module.css",
  `
.pageHeader {
  min-height: 128px;
  gap: 24px;
}

.pageHeader h1 {
  color: var(--a-heading);
  font-size: clamp(40px,3.6vw,58px);
}

.pageHeader p:not(.eyebrow) {
  max-width: 820px;
  color: var(--a-muted);
  font-size: 12px;
  line-height: 1.55;
}

.eyebrow {
  color: var(--a-gold);
  font-size: 9px;
}

.nucleusBadge {
  color: var(--a-gold-strong);
  border-color: var(--a-border);
  background: var(--a-gold-soft);
  font-size: 9px;
}

.grid2 {
  grid-template-columns: repeat(2,minmax(0,1fr));
}

.card,
.formCard,
.tableCard {
  color: var(--a-text);
  border-color: var(--a-border);
  background: var(--a-surface);
  box-shadow: var(--a-shadow);
}

.card {
  padding: 20px;
}

.card h2,
.formCard h2,
.tableCard h2 {
  color: var(--a-heading);
  font-size: 20px;
}

.card > p {
  color: var(--a-muted);
  font-size: 11px;
}

.metric span {
  font-size: 10px;
}

.metric strong {
  font-size: 27px;
}

.tableHeader {
  padding: 18px 20px 14px;
  border-color: var(--a-border-soft);
}

.table th,
.table td {
  padding: 13px 15px;
  border-color: var(--a-border-soft);
}

.table th {
  color: var(--a-muted-2);
  font-size: 9px;
}

.table td {
  color: var(--a-text);
  font-size: 11px;
}

.tag {
  color: var(--a-gold-strong);
  border-color: var(--a-border);
  background: var(--a-gold-soft);
  font-size: 8px;
}

.empty {
  color: var(--a-muted-2);
  font-size: 11px;
}

.formCard {
  padding: 20px;
}

.formCard form {
  gap: 14px;
  margin-top: 17px;
}

.formGrid {
  gap: 12px;
}

.field {
  gap: 7px;
  color: var(--a-muted);
  font-size: 10px;
}

.field input,
.field select,
.field textarea {
  min-height: 44px;
  padding: 10px 12px;
  color: var(--a-control-text);
  border-color: var(--a-control-border);
  background: var(--a-control-bg);
  font-size: 12px;
}

.field select option,
.field select optgroup {
  color: var(--a-option-text);
  background: var(--a-option-bg);
}

.primaryButton,
.secondaryButton,
.dangerButton {
  min-height: 42px;
  padding-inline: 15px;
  font-size: 10px;
}

.primaryButton {
  color: var(--a-page-bg);
  border-color: var(--a-gold);
  background: var(--a-gold-strong);
}

.secondaryButton {
  color: var(--a-gold-strong);
  border-color: var(--a-border);
}

.notice,
.success,
.error {
  font-size: 10px;
}

.notice {
  color: var(--a-muted);
  border-color: var(--a-border);
  background: var(--a-gold-soft);
}

.approvalCard {
  color: var(--a-text);
  border-color: var(--a-border);
  background: var(--a-surface-2);
}

@media(max-width:980px) and (min-width:721px) {
  .grid2 {
    grid-template-columns: 1fr;
  }
}

@media(max-width:720px) {
  .pageHeader {
    min-height: 0;
  }

  .pageHeader h1 {
    font-size: clamp(2.3rem,12vw,3.5rem);
  }

  .grid2,
  .grid3,
  .formGrid {
    grid-template-columns: 1fr;
  }
}
`,
);

appendOnce(
  "src/components/account-page.module.css",
  `
.page,
.shell {
  color: var(--a-text);
  background: var(--a-page-bg);
}

.card,
.panel {
  color: var(--a-text);
  border-color: var(--a-border);
  background: var(--a-surface);
  box-shadow: var(--a-shadow);
}

input,
select,
textarea {
  color: var(--a-control-text);
  border-color: var(--a-control-border);
  background: var(--a-control-bg);
}

select option,
select optgroup {
  color: var(--a-option-text);
  background: var(--a-option-bg);
}
`,
);

appendOnce(
  "src/components/auth.module.css",
  `
.shell {
  color: var(--a-text);
  background: var(--a-page-bg);
}

.card,
.formPanel {
  color: var(--a-text);
}

.card {
  border-color: var(--a-border);
  background: var(--a-surface);
  box-shadow: var(--a-shadow);
}

.card input,
.card select {
  color: var(--a-control-text);
  border-color: var(--a-control-border);
  background: var(--a-control-bg);
}
`,
);

appendOnce(
  "src/app/onboarding/onboarding.module.css",
  `
.shell {
  color: var(--a-text);
  background: var(--a-page-bg);
}

.card {
  color: var(--a-text);
  border-color: var(--a-border);
  background: var(--a-surface);
  box-shadow: var(--a-shadow);
}
`,
);

appendOnce(
  "src/components/onboarding-form.module.css",
  `
.choice,
.form,
.pending {
  color: var(--a-text);
  border-color: var(--a-border);
  background: var(--a-surface-2);
}

input,
select {
  color: var(--a-control-text);
  border-color: var(--a-control-border);
  background: var(--a-control-bg);
}

select option,
select optgroup {
  color: var(--a-option-text);
  background: var(--a-option-bg);
}
`,
);

appendOnce(
  "src/components/marketing.module.css",
  `
.page,
.shell {
  color: var(--a-text);
  background: var(--a-page-bg);
}

.header,
.card,
.cta,
.footer {
  color: var(--a-text);
}

.card,
.cta {
  border-color: var(--a-border);
  background: var(--a-surface);
  box-shadow: var(--a-shadow);
}
`,
);

appendOnce(
  "src/app/landing.module.css",
  `
.page {
  color: var(--a-text);
  background: var(--a-page-bg);
}

.header {
  color: var(--a-text);
}

.problemCard,
.history,
.finalCta {
  border-color: var(--a-border);
  background-color: var(--a-surface);
}
`,
);

appendOnce(
  "src/components/mobile-finance-nav.module.css",
  `
.field select {
  color: var(--a-control-text);
  border-color: var(--a-control-border);
  background: var(--a-control-bg);
}

.field select option,
.field select optgroup {
  color: var(--a-option-text);
  background: var(--a-option-bg);
}
`,
);

console.log("");
console.log("AUREUM Global UX + Demo V2 aplicado.");
console.log("Valide com:");
console.log("  npm.cmd run typecheck");
console.log("  npm.cmd run build");
