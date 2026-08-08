import fs from "node:fs";

function block(...lines) {
  return lines.join("\n");
}

function read(path) {
  return fs.readFileSync(path, "utf8").replace(/\r\n/g, "\n");
}

function write(path, content) {
  fs.writeFileSync(path, content, "utf8");
}

function replaceFirst(path, oldText, newText) {
  const content = read(path);
  const index = content.indexOf(oldText);

  if (index < 0) {
    throw new Error(
      `Trecho não encontrado em ${path}\n\n${oldText}`,
    );
  }

  write(
    path,
    content.slice(0, index) +
      newText +
      content.slice(index + oldText.length),
  );
}

// ---------------------------------------------------------------
// PT-BR landing
// ---------------------------------------------------------------
{
  const path = "src/app/page.tsx";

  replaceFirst(
    path,
    'import Link from "next/link";',
    block(
      'import Link from "next/link";',
      'import { LandingDemoLink } from "@/components/landing-demo-link";',
      'import { LanguageMenu } from "@/components/language-menu";',
    ),
  );

  replaceFirst(
    path,
    '          <Link href="/demonstracao">Demonstração</Link>',
    block(
      '          <span style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>',
      '            <LandingDemoLink href="/demonstracao">',
      '              Demonstração',
      '            </LandingDemoLink>',
      '            <LanguageMenu currentLocale="pt-BR" route="home" />',
      '          </span>',
    ),
  );

  replaceFirst(
    path,
    block(
      '            <Link className={styles.secondaryButton} href="/demonstracao">',
      '              <span className={styles.playButton}>▶</span>',
      '              Ver demonstração',
      '            </Link>',
    ),
    block(
      '            <LandingDemoLink',
      '              className={styles.secondaryButton}',
      '              href="/demonstracao"',
      '              loadingText="Carregando demonstração..."',
      '            >',
      '              <span className={styles.playButton}>▶</span>',
      '              Ver demonstração',
      '            </LandingDemoLink>',
    ),
  );
}

// ---------------------------------------------------------------
// English landing
// ---------------------------------------------------------------
{
  const path = "src/components/english-landing.tsx";

  replaceFirst(
    path,
    'import Link from "next/link";',
    block(
      'import Link from "next/link";',
      'import { LandingDemoLink } from "@/components/landing-demo-link";',
      'import { LanguageMenu } from "@/components/language-menu";',
    ),
  );

  replaceFirst(
    path,
    '          <Link href={`${prefix}/demo`}>Demo</Link>',
    block(
      '          <span style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>',
      '            <LandingDemoLink',
      '              href={`${prefix}/demo`}',
      '              loadingText="Loading demo..."',
      '            >',
      '              Demo',
      '            </LandingDemoLink>',
      '            <LanguageMenu currentLocale={locale} route="home" />',
      '          </span>',
    ),
  );

  replaceFirst(
    path,
    block(
      '      <div style={{ width: "min(1380px,calc(100% - 96px))", margin: "-8px auto 0", display: "flex", justifyContent: "flex-end", gap: 8, fontSize: 11 }}>',
      '        <Link href="/" style={{ color: "#7f90a7" }}>PT-BR</Link>',
      '        <span style={{ color: "#42546e" }}>•</span>',
      '        <Link href="/en-us" style={{ color: locale === "en-US" ? "#e4aa32" : "#7f90a7" }}>EN-US</Link>',
      '        <span style={{ color: "#42546e" }}>•</span>',
      '        <Link href="/en-gb" style={{ color: locale === "en-GB" ? "#e4aa32" : "#7f90a7" }}>EN-GB</Link>',
      '      </div>',
      '',
    ),
    '',
  );

  replaceFirst(
    path,
    block(
      '            <Link className={styles.secondaryButton} href={`${prefix}/demo`}>',
      '              <span className={styles.playButton}>▶</span>',
      '              {t.landing.seeDemo}',
      '            </Link>',
    ),
    block(
      '            <LandingDemoLink',
      '              className={styles.secondaryButton}',
      '              href={`${prefix}/demo`}',
      '              loadingText="Loading demo..."',
      '            >',
      '              <span className={styles.playButton}>▶</span>',
      '              {t.landing.seeDemo}',
      '            </LandingDemoLink>',
    ),
  );
}

// ---------------------------------------------------------------
// PT-BR marketing shell
// ---------------------------------------------------------------
{
  const path = "src/components/marketing-shell.tsx";

  replaceFirst(
    path,
    'import type { ReactNode } from "react";',
    block(
      'import type { ReactNode } from "react";',
      'import {',
      '  LanguageMenu,',
      '  type LanguageRoute,',
      '} from "@/components/language-menu";',
    ),
  );

  replaceFirst(
    path,
    '  const year = new Date().getFullYear();',
    block(
      '  const year = new Date().getFullYear();',
      '  const languageRoute: LanguageRoute =',
      '    active === "recursos"',
      '      ? "resources"',
      '      : active === "para-quem"',
      '        ? "for-whom"',
      '        : active === "seguranca"',
      '          ? "security"',
      '          : active === "sobre-nos"',
      '            ? "about"',
      '            : active === "amor"',
      '              ? "love"',
      '              : active === "ordo"',
      '                ? "order"',
      '                : active === "progressus"',
      '                  ? "progress"',
      '                  : "home";',
    ),
  );

  replaceFirst(
    path,
    '          <Link href="/demonstracao">Demonstração</Link>',
    block(
      '          <span style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>',
      '            <Link href="/demonstracao">Demonstração</Link>',
      '            <LanguageMenu currentLocale="pt-BR" route={languageRoute} />',
      '          </span>',
    ),
  );
}

// ---------------------------------------------------------------
// English marketing shell
// ---------------------------------------------------------------
{
  const path = "src/components/english-marketing-shell.tsx";

  replaceFirst(
    path,
    'import type { ReactNode } from "react";',
    block(
      'import type { ReactNode } from "react";',
      'import {',
      '  LanguageMenu,',
      '  type LanguageRoute,',
      '} from "@/components/language-menu";',
    ),
  );

  replaceFirst(
    path,
    '  const prefix = localePrefix(locale);',
    block(
      '  const prefix = localePrefix(locale);',
      '  const languageRoute: LanguageRoute =',
      '    active === "resources"',
      '      ? "resources"',
      '      : active === "for-whom"',
      '        ? "for-whom"',
      '        : active === "security"',
      '          ? "security"',
      '          : active === "about"',
      '            ? "about"',
      '            : active === "love"',
      '              ? "love"',
      '              : active === "order"',
      '                ? "order"',
      '                : active === "progress"',
      '                  ? "progress"',
      '                  : "home";',
    ),
  );

  replaceFirst(
    path,
    '          <Link href={`${prefix}/demo`}>{t.common.demo}</Link>',
    block(
      '          <span style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>',
      '            <Link href={`${prefix}/demo`}>{t.common.demo}</Link>',
      '            <LanguageMenu currentLocale={locale} route={languageRoute} />',
      '          </span>',
    ),
  );

  replaceFirst(
    path,
    block(
      '      <div style={{ width: "min(1320px,calc(100% - 64px))", margin: "0 auto", display: "flex", justifyContent: "flex-end", gap: 8, fontSize: 11 }}>',
      '        <Link href="/" style={{ color: "#8294ad" }}>PT-BR</Link>',
      '        <span style={{ color: "#42546e" }}>•</span>',
      '        <Link href="/en-us" style={{ color: locale === "en-US" ? "#e4aa32" : "#8294ad" }}>EN-US</Link>',
      '        <span style={{ color: "#42546e" }}>•</span>',
      '        <Link href="/en-gb" style={{ color: locale === "en-GB" ? "#e4aa32" : "#8294ad" }}>EN-GB</Link>',
      '      </div>',
      '',
    ),
    '',
  );
}

console.log(
  "AUREUM: seletor de idioma e transição para demonstração aplicados.",
);
