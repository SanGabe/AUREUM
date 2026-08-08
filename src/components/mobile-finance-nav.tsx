"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { AppLocale } from "@/i18n/locales";
import {
  financeSectionPath,
  joinNucleusPath,
  type FinanceSection,
} from "@/components/finance-navigation";
import type { NucleusOption } from "@/components/dashboard-controls";
import { ThemeButtons } from "@/components/theme-selector";
import styles from "./mobile-finance-nav.module.css";

const MAIN: FinanceSection[] = [
  "dashboard",
  "transactions",
  "accounts",
  "goals",
];

const ALL: FinanceSection[] = [
  "dashboard",
  "transactions",
  "categories",
  "goals",
  "accounts",
  "investments",
  "exchange-rates",
  "approvals",
];

const ICONS: Record<FinanceSection, string> = {
  dashboard: "◫",
  transactions: "↕",
  categories: "◌",
  goals: "◎",
  accounts: "▤",
  investments: "↗",
  "exchange-rates": "¤",
  approvals: "✓",
};

function labels(locale: AppLocale) {
  const pt = locale === "pt-BR";
  return {
    dashboard: pt ? "Resumo" : "Overview",
    transactions: pt ? "Transações" : "Transactions",
    categories: pt ? "Categorias" : "Categories",
    goals: pt ? "Metas" : "Goals",
    accounts: pt ? "Contas" : "Accounts",
    investments: pt ? "Investimentos" : "Investments",
    "exchange-rates": pt ? "Cotações" : "Rates",
    approvals: pt ? "Aprovações" : "Approvals",
    more: pt ? "Mais" : "More",
    nucleus: pt ? "Núcleo" : "Nucleus",
    language: pt ? "Idioma" : "Language",
    appearance: pt ? "Aparência" : "Appearance",
    addNucleus: pt ? "Adicionar Núcleo existente" : "Join existing Nucleus",
    close: pt ? "Fechar menu" : "Close menu",
  } satisfies Record<string, string>;
}

function buildHref(
  section: FinanceSection,
  locale: AppLocale,
  householdId: string,
  month: string,
) {
  const params = new URLSearchParams({
    household: householdId,
    month,
  });

  return `${financeSectionPath(section, locale)}?${params.toString()}`;
}

export function MobileFinanceNav({
  active,
  currentNucleusId = "",
  demo = false,
  locale,
  month,
  nuclei = [],
  userName,
}: {
  active: FinanceSection;
  currentNucleusId?: string;
  demo?: boolean;
  locale: AppLocale;
  month: string;
  nuclei?: NucleusOption[];
  userName: string;
}) {
  const router = useRouter();
  const t = labels(locale);
  const [open, setOpen] = useState(false);

  const current = useMemo(
    () => nuclei.find((item) => item.id === currentNucleusId),
    [currentNucleusId, nuclei],
  );

  if (demo) {
    const home = locale === "pt-BR" ? "/" : `/${locale.toLowerCase()}`;

    return (
      <>
        <header className={styles.topbar}>
          <Link aria-label="AUREUM" className={styles.logo} href={home}>
            <img src="/brand/aureum-logo-hq.png" alt="AUREUM" />
          </Link>
          <div className={styles.topbarCopy}>
            <strong>{locale === "pt-BR" ? "Demonstração" : "Demo"}</strong>
            <small>AUREUM</small>
          </div>
          <Link className={styles.menuButton} href={home} aria-label={locale === "pt-BR" ? "Voltar" : "Back"}>
            ←
          </Link>
        </header>

        <nav className={styles.bottomNav}>
          <a href="#resumo"><span>◫</span><small>{t.dashboard}</small></a>
          <a href="#transacoes"><span>↕</span><small>{t.transactions}</small></a>
          <a href="#categorias"><span>◌</span><small>{t.categories}</small></a>
          <a href="#metas"><span>◎</span><small>{t.goals}</small></a>
          <Link href={home}><span>⌂</span><small>{locale === "pt-BR" ? "Início" : "Home"}</small></Link>
        </nav>
      </>
    );
  }

  function changeNucleus(id: string) {
    if (id === "__join__") {
      router.push(
        `${joinNucleusPath(locale)}?household=${encodeURIComponent(currentNucleusId)}&month=${encodeURIComponent(month)}`,
      );
      setOpen(false);
      return;
    }

    if (id === currentNucleusId) return;

    router.push(buildHref(active, locale, id, month));
    setOpen(false);
  }

  function changeLanguage(next: AppLocale) {
    if (next === locale) return;

    router.push(
      buildHref(active, next, currentNucleusId, month),
    );
    setOpen(false);
  }

  return (
    <>
      <header className={styles.topbar}>
        <Link
          aria-label="AUREUM"
          className={styles.logo}
          href={financeSectionPath("dashboard", locale)}
        >
          <img src="/brand/aureum-logo-hq.png" alt="AUREUM" />
        </Link>

        <div className={styles.topbarCopy}>
          <strong>{current?.name ?? "AUREUM"}</strong>
          <small>{userName}</small>
        </div>

        <button
          aria-expanded={open}
          aria-label={t.more}
          className={styles.menuButton}
          onClick={() => setOpen(true)}
          type="button"
        >
          ☰
        </button>
      </header>

      <nav className={styles.bottomNav}>
        {MAIN.map((section) => (
          <Link
            className={active === section ? styles.active : ""}
            href={buildHref(
              section,
              locale,
              currentNucleusId,
              month,
            )}
            key={section}
          >
            <span>{ICONS[section]}</span>
            <small>{t[section]}</small>
          </Link>
        ))}

        <button
          aria-expanded={open}
          className={!MAIN.includes(active) ? styles.active : ""}
          onClick={() => setOpen(true)}
          type="button"
        >
          <span>•••</span>
          <small>{t.more}</small>
        </button>
      </nav>

      {open ? (
        <div
          className={styles.overlay}
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <aside
            aria-label={t.more}
            className={styles.drawer}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.drawerHandle} />

            <header className={styles.drawerHeader}>
              <div>
                <strong>AUREUM</strong>
                <small>{current?.name ?? ""}</small>
              </div>

              <button
                aria-label={t.close}
                onClick={() => setOpen(false)}
                type="button"
              >
                ×
              </button>
            </header>

            <nav className={styles.allLinks}>
              {ALL.map((section) => (
                <Link
                  className={active === section ? styles.active : ""}
                  href={buildHref(
                    section,
                    locale,
                    currentNucleusId,
                    month,
                  )}
                  key={section}
                  onClick={() => setOpen(false)}
                >
                  <span>{ICONS[section]}</span>
                  <strong>{t[section]}</strong>
                </Link>
              ))}
            </nav>

            <div className={styles.divider} />

            <label className={styles.field}>
              <span>{t.nucleus}</span>
              <select
                onChange={(event) =>
                  changeNucleus(event.target.value)
                }
                value={currentNucleusId}
              >
                {nuclei.map((nucleus) => (
                  <option key={nucleus.id} value={nucleus.id}>
                    {nucleus.name} — {nucleus.roleLabel}
                  </option>
                ))}
                <option disabled value="__separator__">
                  ─────────────
                </option>
                <option value="__join__">＋ {t.addNucleus}</option>
              </select>
            </label>

            <label className={styles.field}>
              <span>{t.language}</span>
              <select
                onChange={(event) =>
                  changeLanguage(event.target.value as AppLocale)
                }
                value={locale}
              >
                <option value="pt-BR">Português — Brasil</option>
                <option value="en-US">English — United States</option>
                <option value="en-GB">English — United Kingdom</option>
              </select>
            </label>

            <div className={styles.themeBlock}>
              <span>{t.appearance}</span>
              <ThemeButtons locale={locale} />
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
