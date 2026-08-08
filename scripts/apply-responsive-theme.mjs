import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const MARKER = "/* AUREUM RESPONSIVE THEME V1 */";

function file(rel) {
  return path.join(ROOT, rel);
}

function exists(rel) {
  return fs.existsSync(file(rel));
}

function read(rel) {
  return fs.readFileSync(file(rel), "utf8").replace(/\r\n/g, "\n");
}

function write(rel, content) {
  fs.writeFileSync(file(rel), content, "utf8");
}

function replaceOnce(content, oldText, newText) {
  if (content.includes(newText)) return content;
  const index = content.indexOf(oldText);
  if (index < 0) return content;
  return (
    content.slice(0, index) +
    newText +
    content.slice(index + oldText.length)
  );
}

function ensureImport(content, anchor, importLine) {
  if (content.includes(importLine)) return content;
  return replaceOnce(
    content,
    anchor,
    `${anchor}\n${importLine}`,
  );
}

function updateTsx(rel, transform) {
  if (!exists(rel)) return;
  const before = read(rel);
  const after = transform(before);
  if (before !== after) {
    write(rel, after);
    console.log(`OK TSX: ${rel}`);
  } else {
    console.log(`SEM ALTERAÇÃO TSX: ${rel}`);
  }
}

function themeCss(content) {
  const replacements = [
    ["#000e22", "var(--a-page-bg)"],
    ["#00142f", "var(--a-page-bg-2)"],
    ["#031a35", "var(--a-sidebar-1)"],
    ["#001126", "var(--a-sidebar-2)"],
    ["#03172f", "var(--a-surface)"],
    ["#061b35", "var(--a-surface)"],
    ["#061f3e", "var(--a-surface-2)"],
    ["#041a34", "var(--a-surface-2)"],
    ["#04152c", "var(--a-input)"],
    ["#04162e", "var(--a-surface-3)"],
    ["#03152d", "var(--a-surface-3)"],
    ["#03152c", "var(--a-surface-3)"],
    ["#06142d", "var(--a-sidebar-2)"],
    ["#061830", "var(--a-surface)"],
    ["#051a35", "var(--a-surface)"],
    ["#071b3e", "var(--a-page-bg-2)"],
    ["#06152f", "var(--a-page-bg)"],

    ["#e7ecf4", "var(--a-text)"],
    ["#f1ece2", "var(--a-heading)"],
    ["#f2ece1", "var(--a-heading)"],
    ["#f4eee3", "var(--a-heading)"],
    ["#f5eee1", "var(--a-heading)"],
    ["#f3eee4", "var(--a-heading)"],
    ["#e9edf3", "var(--a-text)"],
    ["#edf0f4", "var(--a-text)"],
    ["#f0ece5", "var(--a-heading)"],

    ["#899ab1", "var(--a-muted)"],
    ["#91a2b9", "var(--a-muted)"],
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

    ["#e4aa32", "var(--a-gold)"],
    ["#dca833", "var(--a-gold)"],
    ["#dba632", "var(--a-gold)"],
    ["#d9a12d", "var(--a-gold)"],
    ["#e7ad35", "var(--a-gold)"],
    ["#dba536", "var(--a-gold)"],
    ["#efba4b", "var(--a-gold-strong)"],
    ["#efbd4d", "var(--a-gold-strong)"],
    ["#f0c15b", "var(--a-gold-strong)"],
    ["#efc15b", "var(--a-gold-strong)"],
    ["#efc15d", "var(--a-gold-strong)"],
    ["#d8b45a", "var(--a-gold-strong)"],
    ["#d8ad4e", "var(--a-gold-strong)"],
    ["#cfaa58", "var(--a-gold-strong)"],
    ["#c9a54e", "var(--a-gold-strong)"],

    ["#55d39f", "var(--a-success)"],
    ["#5bd6a4", "var(--a-success)"],
    ["#42d3a1", "var(--a-success)"],
    ["#57d7ac", "var(--a-success)"],
    ["#ed7770", "var(--a-danger)"],
    ["#dc8580", "var(--a-danger)"],
    ["#ff7070", "var(--a-danger)"],
    ["#ff8d8d", "var(--a-danger)"],

    ["rgba(0,10,25,.78)", "var(--a-overlay)"],
    ["rgba(255,255,255,.07)", "var(--a-border-soft)"],
    ["rgba(255,255,255,.065)", "var(--a-border-soft)"],
    ["rgba(255,255,255,.055)", "var(--a-border-soft)"],
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
  ];

  let result = content;
  for (const [from, to] of replacements) {
    result = result.split(from).join(to);
  }
  return result;
}

function updateCss(rel, extra) {
  if (!exists(rel)) return;
  let content = themeCss(read(rel));

  if (!content.includes(MARKER)) {
    content = `${content.trim()}\n\n${MARKER}\n${extra.trim()}\n`;
  }

  write(rel, content);
  console.log(`OK CSS: ${rel}`);
}

// ---------------------------------------------------------------
// LANDING / MARKETING HEADER
// ---------------------------------------------------------------

updateTsx("src/app/page.tsx", (s) => {
  s = ensureImport(
    s,
    'import { LanguageMenu } from "@/components/language-menu";',
    'import { MarketingMobileMenu } from "@/components/marketing-mobile-menu";',
  );
  s = ensureImport(
    s,
    'import { MarketingMobileMenu } from "@/components/marketing-mobile-menu";',
    'import { ThemeHeaderSelect } from "@/components/theme-selector";',
  );

  s = replaceOnce(
    s,
    '            <LanguageMenu currentLocale="pt-BR" route="home" />',
    [
      '            <LanguageMenu currentLocale="pt-BR" route="home" />',
      '            <ThemeHeaderSelect locale="pt-BR" />',
    ].join("\n"),
  );

  s = replaceOnce(
    s,
    '        </div>\n      </header>',
    [
      '        </div>',
      '',
      '        <MarketingMobileMenu',
      '          currentLocale="pt-BR"',
      '          route="home"',
      '        />',
      '      </header>',
    ].join("\n"),
  );

  return s;
});

updateTsx("src/components/english-landing.tsx", (s) => {
  s = ensureImport(
    s,
    'import { LanguageMenu } from "@/components/language-menu";',
    'import { MarketingMobileMenu } from "@/components/marketing-mobile-menu";',
  );
  s = ensureImport(
    s,
    'import { MarketingMobileMenu } from "@/components/marketing-mobile-menu";',
    'import { ThemeHeaderSelect } from "@/components/theme-selector";',
  );

  s = replaceOnce(
    s,
    '            <LanguageMenu currentLocale={locale} route="home" />',
    [
      '            <LanguageMenu currentLocale={locale} route="home" />',
      '            <ThemeHeaderSelect locale={locale} />',
    ].join("\n"),
  );

  s = replaceOnce(
    s,
    '        </div>\n      </header>',
    [
      '        </div>',
      '',
      '        <MarketingMobileMenu',
      '          currentLocale={locale}',
      '          route="home"',
      '        />',
      '      </header>',
    ].join("\n"),
  );

  return s;
});

updateTsx("src/components/marketing-shell.tsx", (s) => {
  s = ensureImport(
    s,
    '} from "@/components/language-menu";',
    'import { MarketingMobileMenu } from "@/components/marketing-mobile-menu";',
  );
  s = ensureImport(
    s,
    'import { MarketingMobileMenu } from "@/components/marketing-mobile-menu";',
    'import { ThemeHeaderSelect } from "@/components/theme-selector";',
  );

  s = replaceOnce(
    s,
    '            <LanguageMenu currentLocale="pt-BR" route={languageRoute} />',
    [
      '            <LanguageMenu currentLocale="pt-BR" route={languageRoute} />',
      '            <ThemeHeaderSelect locale="pt-BR" />',
    ].join("\n"),
  );

  s = replaceOnce(
    s,
    '        </div>\n      </header>',
    [
      '        </div>',
      '',
      '        <MarketingMobileMenu',
      '          currentLocale="pt-BR"',
      '          route={languageRoute}',
      '        />',
      '      </header>',
    ].join("\n"),
  );

  return s;
});

updateTsx("src/components/english-marketing-shell.tsx", (s) => {
  s = ensureImport(
    s,
    '} from "@/components/language-menu";',
    'import { MarketingMobileMenu } from "@/components/marketing-mobile-menu";',
  );
  s = ensureImport(
    s,
    'import { MarketingMobileMenu } from "@/components/marketing-mobile-menu";',
    'import { ThemeHeaderSelect } from "@/components/theme-selector";',
  );

  s = replaceOnce(
    s,
    '            <LanguageMenu currentLocale={locale} route={languageRoute} />',
    [
      '            <LanguageMenu currentLocale={locale} route={languageRoute} />',
      '            <ThemeHeaderSelect locale={locale} />',
    ].join("\n"),
  );

  s = replaceOnce(
    s,
    '        </div>\n      </header>',
    [
      '        </div>',
      '',
      '        <MarketingMobileMenu',
      '          currentLocale={locale}',
      '          route={languageRoute}',
      '        />',
      '      </header>',
    ].join("\n"),
  );

  return s;
});

// ---------------------------------------------------------------
// CSS — dashboard / finance
// ---------------------------------------------------------------

updateCss(
  "src/components/dashboard-view.module.css",
  `
.shell {
  color: var(--a-text);
  background: var(--a-page-bg);
}

.sidebar {
  border-color: var(--a-border);
  background: linear-gradient(180deg,var(--a-sidebar-1),var(--a-sidebar-2));
}

.profileMenu,
.monthPopover {
  color: var(--a-text);
  background: var(--a-surface);
  box-shadow: var(--a-shadow);
}

.profileNucleus select,
.monthArrow,
.monthMain,
.monthPopoverHeader button,
.monthGrid button {
  color: var(--a-text);
  background: var(--a-input);
}

.summary article {
  color: var(--a-text);
  background: var(--a-card-gradient);
}

.panel {
  color: var(--a-text);
  background: var(--a-surface);
}

@media(max-width:1180px) {
  .shell {
    grid-template-columns: 230px minmax(0,1fr);
  }

  .sidebar {
    padding-inline: 15px;
  }

  .brand {
    width: 178px;
  }

  .content {
    padding-inline: 28px;
  }

  .summary {
    grid-template-columns: repeat(2,minmax(0,1fr));
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
    padding: 27px 20px 112px;
  }

  .grid {
    grid-template-columns: 1fr;
  }

  .top {
    margin-top: 8px;
  }

  .panel {
    min-height: 0;
  }
}

@media(max-width:700px) {
  .content {
    padding: 20px 12px 108px;
  }

  .top {
    display: grid;
    gap: 12px;
  }

  .top h1 {
    font-size: clamp(2.15rem,12vw,3.4rem);
  }

  .top p:not(.eyebrow) {
    font-size: 11px;
    line-height: 1.5;
  }

  .liveBadge,
  .demoBadge {
    width: max-content;
    margin-top: 0;
  }

  .periodBar {
    width: 100%;
  }

  .monthNavigator,
  .monthControl {
    width: 100%;
  }

  .monthControl {
    grid-template-columns: 42px minmax(0,1fr) 42px;
  }

  .monthMain {
    min-width: 0;
  }

  .monthMain strong {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .monthPopover {
    right: 0;
    left: 0;
    width: min(100%,360px);
  }

  .summary {
    gap: 9px;
  }

  .summary article {
    min-height: 118px;
    padding: 15px;
  }

  .summary span {
    font-size: 9px;
  }

  .summary small {
    font-size: 8px;
  }

  .panel {
    padding: 16px;
  }

  .panelHead {
    gap: 10px;
  }

  .panelHead h2 {
    font-size: 19px;
  }

  .transaction {
    grid-template-columns: 34px minmax(0,1fr);
  }

  .txValue {
    grid-column: 2;
    text-align: left;
  }

  .structure {
    grid-template-columns: repeat(3,minmax(0,1fr));
    gap: 6px;
  }
}

@media(max-width:430px) {
  .summary {
    grid-template-columns: 1fr;
  }

  .summary article {
    min-height: 104px;
  }

  .monthGrid {
    grid-template-columns: repeat(2,1fr);
  }
}
`,
);

updateCss(
  "src/components/finance-page.module.css",
  `
.pageHeader h1,
.card h2,
.formCard h2,
.tableCard h2 {
  color: var(--a-heading);
}

.card,
.formCard,
.tableCard {
  border-color: var(--a-border);
  background: var(--a-surface);
  box-shadow: var(--a-shadow);
}

.field input,
.field select,
.field textarea {
  color: var(--a-text);
  background: var(--a-input);
  border-color: var(--a-border);
}

.themeSetting {
  display: grid;
  gap: 8px;
}

.themeSetting > span {
  color: var(--a-muted);
  font-size: 9px;
  font-weight: 700;
}

@media(max-width:1180px) {
  .grid3 {
    grid-template-columns: repeat(2,minmax(0,1fr));
  }
}

@media(max-width:1024px) {
  .pageHeader {
    min-height: 118px;
    padding-top: 4px;
  }

  .pageHeader h1 {
    font-size: clamp(2.15rem,8vw,3.5rem);
  }
}

@media(max-width:720px) {
  .pageHeader {
    min-height: 0;
    display: grid;
    gap: 10px;
    margin-bottom: 18px;
  }

  .nucleusBadge {
    margin: 0;
  }

  .grid2,
  .grid3,
  .formGrid {
    grid-template-columns: 1fr;
  }

  .toolbar {
    align-items: stretch;
  }

  .tableCard {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .table {
    min-width: 680px;
  }

  .formCard,
  .card {
    padding: 15px;
  }

  .primaryButton,
  .secondaryButton,
  .dangerButton {
    min-height: 44px;
  }
}

@media(max-width:460px) {
  .table {
    min-width: 620px;
  }
}
`,
);

// ---------------------------------------------------------------
// CSS — landing / marketing
// ---------------------------------------------------------------

updateCss(
  "src/app/landing.module.css",
  `
.page {
  color: var(--a-text);
  background: var(--a-page-bg);
}

@media(max-width:1020px) {
  .header {
    width: calc(100% - 32px);
    min-height: 72px;
    height: auto;
    padding-block: 10px;
  }

  .nav,
  .headerActions {
    display: none !important;
  }

  .headerLogo {
    width: 150px;
  }

  .hero {
    width: calc(100% - 32px);
    grid-template-columns: 1fr !important;
    gap: 38px;
    padding-top: 48px;
  }

  .heroCopy {
    max-width: 760px;
  }

  .hero > * {
    min-width: 0;
  }

  .trustRow {
    max-width: 720px;
  }
}

@media(max-width:650px) {
  .header {
    width: calc(100% - 20px);
  }

  .headerLogo {
    width: 132px;
  }

  .hero {
    width: calc(100% - 24px);
    padding-top: 34px;
  }

  .hero h1 {
    font-size: clamp(2.6rem,14vw,4rem);
    line-height: .96;
  }

  .heroText {
    font-size: 14px;
    line-height: 1.6;
  }

  .heroActions {
    display: grid;
    grid-template-columns: 1fr;
  }

  .heroActions a {
    width: 100%;
    min-height: 48px;
  }

  .trustRow {
    grid-template-columns: 1fr !important;
    gap: 12px;
  }

  .problemCard,
  .principles,
  .history,
  .finalCta,
  .footer {
    width: calc(100% - 24px) !important;
  }
}
`,
);

updateCss(
  "src/components/marketing.module.css",
  `
.page {
  color: var(--a-text);
  background: var(--a-page-bg);
}

@media(max-width:1020px) {
  .header {
    width: calc(100% - 32px);
    min-height: 72px;
    height: auto;
    padding-block: 10px;
  }

  .nav,
  .headerActions {
    display: none !important;
  }

  .logo {
    width: 150px;
  }

  .hero,
  .content,
  .cta,
  .footer {
    width: calc(100% - 32px);
  }

  .hero {
    grid-template-columns: 1fr !important;
    gap: 28px;
  }

  .cards3 {
    grid-template-columns: repeat(2,minmax(0,1fr)) !important;
  }

  .split {
    grid-template-columns: 1fr !important;
  }

  .footerTop {
    grid-template-columns: repeat(2,minmax(0,1fr)) !important;
  }
}

@media(max-width:620px) {
  .header,
  .hero,
  .content,
  .cta,
  .footer {
    width: calc(100% - 24px);
  }

  .logo {
    width: 132px;
  }

  .hero h1 {
    font-size: clamp(2.3rem,13vw,3.6rem);
  }

  .heroActions {
    display: grid;
  }

  .heroActions a {
    width: 100%;
  }

  .cards3,
  .footerTop {
    grid-template-columns: 1fr !important;
  }

  .card {
    min-height: 0 !important;
  }

  .footerBottom {
    display: grid !important;
    gap: 10px;
  }
}
`,
);

// ---------------------------------------------------------------
// CSS — auth / onboarding / account / dropdown / loader
// ---------------------------------------------------------------

updateCss(
  "src/components/auth.module.css",
  `
.shell {
  color: var(--a-text);
  background: var(--a-page-bg);
}

@media(max-width:820px) {
  .shell {
    min-height: 100dvh;
    grid-template-columns: 1fr !important;
  }

  .brandPanel {
    min-height: 220px;
    padding: 24px 22px;
  }

  .brandCopy {
    margin-top: 26px;
  }

  .authBird {
    display: none;
  }

  .formPanel {
    min-height: auto;
    padding: 22px 14px 36px;
  }

  .card {
    width: min(100%,520px);
  }
}

@media(max-width:480px) {
  .brandPanel {
    min-height: 180px;
    padding: 18px 16px;
  }

  .brandLogo img {
    max-width: 150px;
  }

  .formPanel {
    padding-inline: 10px;
  }
}
`,
);

updateCss(
  "src/app/onboarding/onboarding.module.css",
  `
.shell {
  color: var(--a-text);
  background: var(--a-page-bg);
}

@media(max-width:760px) {
  .shell {
    padding: 14px;
  }

  .card {
    width: 100%;
    padding: 20px 15px;
  }

  .brandHeader img {
    max-width: 170px;
  }

  .bird {
    display: none;
  }
}
`,
);

updateCss(
  "src/components/onboarding-form.module.css",
  `
@media(max-width:680px) {
  .chooseGrid,
  .options {
    grid-template-columns: 1fr !important;
  }

  .choice,
  .form,
  .pending {
    width: 100%;
  }

  .pendingActions {
    display: grid;
    grid-template-columns: 1fr;
  }

  .primary,
  .secondary {
    min-height: 44px;
  }
}
`,
);

updateCss(
  "src/components/account-page.module.css",
  `
.page {
  color: var(--a-text);
  background: var(--a-page-bg);
}

.themeSetting {
  display: grid;
  gap: 8px;
}

.themeSetting > span {
  color: var(--a-muted);
  font-size: 9px;
  font-weight: 700;
}

@media(max-width:720px) {
  .header {
    min-height: 70px;
    padding-inline: 14px;
  }

  .logo img {
    max-width: 145px;
  }

  .content {
    width: calc(100% - 24px);
    padding-top: 30px;
  }

  .content h1 {
    font-size: clamp(2.2rem,12vw,3.5rem);
  }

  .card {
    padding: 16px;
  }

  .back {
    font-size: 9px;
  }
}
`,
);

updateCss(
  "src/components/language-menu.module.css",
  `
.trigger,
.menu {
  color: var(--a-text);
  background: var(--a-surface);
  border-color: var(--a-border);
}

.menu > a {
  color: var(--a-muted);
}

@media(max-width:1020px) {
  .wrap {
    display: none;
  }
}
`,
);

updateCss(
  "src/components/landing-demo-link.module.css",
  `
.overlay {
  background: var(--a-overlay);
}

.card {
  color: var(--a-text);
  background: var(--a-surface);
  border-color: var(--a-border);
  box-shadow: var(--a-shadow);
}
`,
);

console.log("");
console.log("AUREUM responsive/theme aplicado.");
