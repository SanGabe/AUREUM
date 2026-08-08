"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { AppLocale } from "@/i18n/locales";
import {
  demoFinanceSectionPath,
  financeSectionLabel,
  financeSectionPath,
  FINANCE_ICONS,
  FINANCE_SECTIONS,
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

function labels(locale: AppLocale) {
  const pt = locale === "pt-BR";
  return {
    more: pt ? "Mais" : "More",
    nucleus: pt ? "Núcleo" : "Nucleus",
    language: pt ? "Idioma" : "Language",
    appearance: pt ? "Aparência" : "Appearance",
    addNucleus: pt
      ? "Adicionar Núcleo existente"
      : "Join existing Nucleus",
    close: pt ? "Fechar menu" : "Close menu",
    demo: pt ? "Demonstração" : "Demo",
    exit: pt ? "Sair da demonstração" : "Exit demo",
  };
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
    () =>
      nuclei.find(
        (item) => item.id === currentNucleusId,
      ),
    [currentNucleusId, nuclei],
  );

  const home =
    locale === "pt-BR"
      ? "/"
      : `/${locale.toLowerCase()}`;

  function href(section: FinanceSection) {
    return demo
      ? demoFinanceSectionPath(section, locale)
      : buildHref(
          section,
          locale,
          currentNucleusId,
          month,
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

    router.push(
      buildHref(active, locale, id, month),
    );
    setOpen(false);
  }

  function changeLanguage(next: AppLocale) {
    if (next === locale) return;

    if (demo) {
      router.push(
        demoFinanceSectionPath(active, next),
      );
    } else {
      router.push(
        buildHref(
          active,
          next,
          currentNucleusId,
          month,
        ),
      );
    }

    setOpen(false);
  }

  return (
    <>
      <header className={styles.topbar}>
        <Link
          aria-label="AUREUM"
          className={styles.logo}
          href={
            demo
              ? demoFinanceSectionPath(
                  "dashboard",
                  locale,
                )
              : financeSectionPath(
                  "dashboard",
                  locale,
                )
          }
        >
          <img
            src="/brand/aureum-logo-hq.png"
            alt="AUREUM"
          />
        </Link>

        <div className={styles.topbarCopy}>
          <strong>
            {demo
              ? t.demo
              : current?.name ?? "AUREUM"}
          </strong>
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
            className={
              active === section ? styles.active : ""
            }
            href={href(section)}
            key={section}
          >
            <span>{FINANCE_ICONS[section]}</span>
            <small>
              {financeSectionLabel(section, locale)}
            </small>
          </Link>
        ))}

        <button
          aria-expanded={open}
          className={
            !MAIN.includes(active) ? styles.active : ""
          }
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
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className={styles.drawerHandle} />

            <header className={styles.drawerHeader}>
              <div>
                <strong>AUREUM</strong>
                <small>
                  {demo
                    ? t.demo
                    : current?.name ?? ""}
                </small>
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
              {FINANCE_SECTIONS.map((section) => (
                <Link
                  className={
                    active === section
                      ? styles.active
                      : ""
                  }
                  href={href(section)}
                  key={section}
                  onClick={() => setOpen(false)}
                >
                  <span>
                    {FINANCE_ICONS[section]}
                  </span>
                  <strong>
                    {financeSectionLabel(
                      section,
                      locale,
                    )}
                  </strong>
                </Link>
              ))}
            </nav>

            <div className={styles.divider} />

            {!demo ? (
              <label className={styles.field}>
                <span>{t.nucleus}</span>
                <select
                  onChange={(event) =>
                    changeNucleus(
                      event.target.value,
                    )
                  }
                  value={currentNucleusId}
                >
                  {nuclei.map((nucleus) => (
                    <option
                      key={nucleus.id}
                      value={nucleus.id}
                    >
                      {nucleus.name} —{" "}
                      {nucleus.roleLabel}
                    </option>
                  ))}
                  <option
                    disabled
                    value="__separator__"
                  >
                    ─────────────
                  </option>
                  <option value="__join__">
                    ＋ {t.addNucleus}
                  </option>
                </select>
              </label>
            ) : null}

            <label className={styles.field}>
              <span>{t.language}</span>
              <select
                onChange={(event) =>
                  changeLanguage(
                    event.target
                      .value as AppLocale,
                  )
                }
                value={locale}
              >
                <option value="pt-BR">
                  Português — Brasil
                </option>
                <option value="en-US">
                  English — United States
                </option>
                <option value="en-GB">
                  English — United Kingdom
                </option>
              </select>
            </label>

            <div className={styles.themeBlock}>
              <span>{t.appearance}</span>
              <ThemeButtons locale={locale} />
            </div>

            {demo ? (
              <>
                <div className={styles.divider} />
                <Link
                  href={home}
                  onClick={() => setOpen(false)}
                >
                  ← {t.exit}
                </Link>
              </>
            ) : null}
          </aside>
        </div>
      ) : null}
    </>
  );
}
