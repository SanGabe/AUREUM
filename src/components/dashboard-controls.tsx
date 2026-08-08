"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useDashboardActionLoading } from "@/components/dashboard-action-loading";
import type { AppLocale } from "@/i18n/locales";
import type { EnglishLocale } from "@/i18n/locales";
import { localePrefix } from "@/i18n/locales";
import { getEnglishCopy } from "@/i18n/english-copy";
import { financeSectionPath, joinNucleusPath, type FinanceSection } from "@/components/finance-navigation";
import { ThemeSelect } from "@/components/theme-selector";
import { AccountAvatar } from "@/components/account-avatar";
import styles from "./dashboard-view.module.css";

export type NucleusOption = {
  id: string;
  name: string;
  roleLabel: string;
};

function parseMonth(value: string) {
  const [year, month] = value.split("-").map(Number);
  return { year, month };
}

function toMonthValue(year: number, month: number) {
  const date = new Date(Date.UTC(year, month - 1, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function monthName(month: number, locale: AppLocale) {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    timeZone: "UTC",
  })
    .format(new Date(Date.UTC(2026, month - 1, 1)))
    .replace(".", "")
    .toUpperCase();
}

function fullMonthLabel(value: string, locale: AppLocale) {
  const { year, month } = parseMonth(value);
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })
    .format(new Date(Date.UTC(year, month - 1, 1)))
    .toUpperCase();
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length > 1) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return parts[0]?.slice(0, 2).toUpperCase() || "U";
}

function english(locale: AppLocale) {
  if (locale === "pt-BR") return null;
  return getEnglishCopy(locale as EnglishLocale);
}

export function MonthNavigator({
  currentNucleusId,
  selectedMonth,
  locale = "pt-BR",
  dashboardPath = "/dashboard",
  currentSection = "dashboard",
}: {
  currentNucleusId: string;
  selectedMonth: string;
  locale?: AppLocale;
  dashboardPath?: string;
  currentSection?: FinanceSection;
}) {
  const router = useRouter();
  const { startLoading } = useDashboardActionLoading();
  const pickerRef = useRef<HTMLDivElement>(null);
  const parsed = parseMonth(selectedMonth);
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(parsed.year);
  const en = english(locale);

  useEffect(() => {
    setViewYear(parsed.year);
  }, [parsed.year]);

  useEffect(() => {
    function close(event: MouseEvent) {
      if (!pickerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  function goToMonth(value: string) {
    if (value === selectedMonth) {
      setOpen(false);
      return;
    }

    startLoading(en?.dashboard.loadingPeriod ?? "Carregando período...");
    const targetPath =
      currentSection === "dashboard"
        ? dashboardPath
        : financeSectionPath(currentSection, locale);

    router.push(
      `${targetPath}?household=${encodeURIComponent(currentNucleusId)}&month=${encodeURIComponent(value)}`,
    );
    setOpen(false);
  }

  function move(offset: number) {
    const date = new Date(Date.UTC(parsed.year, parsed.month - 1 + offset, 1));
    goToMonth(
      `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`,
    );
  }

  const today = new Date();
  const currentValue = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

  return (
    <div className={styles.monthNavigator} ref={pickerRef}>
      <span className={styles.periodLabel}>
        {en?.dashboard.period ?? "PERÍODO"}
      </span>

      <div className={styles.monthControl}>
        <button
          aria-label={locale === "pt-BR" ? "Mês anterior" : "Previous month"}
          className={styles.monthArrow}
          onClick={() => move(-1)}
          type="button"
        >
          ‹
        </button>

        <button
          aria-expanded={open}
          className={styles.monthMain}
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          <span className={styles.calendarIcon}>▦</span>
          <strong>{fullMonthLabel(selectedMonth, locale)}</strong>
          <span className={styles.chevron}>{open ? "⌃" : "⌄"}</span>
        </button>

        <button
          aria-label={locale === "pt-BR" ? "Próximo mês" : "Next month"}
          className={styles.monthArrow}
          onClick={() => move(1)}
          type="button"
        >
          ›
        </button>
      </div>

      {open ? (
        <div className={styles.monthPopover}>
          <div className={styles.monthPopoverHeader}>
            <button onClick={() => setViewYear((year) => year - 1)} type="button">
              ‹
            </button>
            <strong>{viewYear}</strong>
            <button onClick={() => setViewYear((year) => year + 1)} type="button">
              ›
            </button>
          </div>

          <div className={styles.monthGrid}>
            {Array.from({ length: 12 }, (_, index) => {
              const month = index + 1;
              const value = toMonthValue(viewYear, month);
              const active = value === selectedMonth;

              return (
                <button
                  className={active ? styles.monthActive : ""}
                  key={value}
                  onClick={() => goToMonth(value)}
                  type="button"
                >
                  {monthName(month, locale)}
                </button>
              );
            })}
          </div>

          <button
            className={styles.todayButton}
            onClick={() => goToMonth(currentValue)}
            type="button"
          >
            {en?.dashboard.currentMonth ?? "Ir para o mês atual"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function ProfileMenu({
  currentNucleusId,
  currentSection = "dashboard",
  nuclei,
  selectedMonth,
  userEmail,
  userName,
  userSubtitle,
  locale = "pt-BR",
}: {
  currentNucleusId: string;
  currentSection?: FinanceSection;
  nuclei: NucleusOption[];
  selectedMonth: string;
  userEmail?: string;
  userName: string;
  userSubtitle: string;
  locale?: AppLocale;
}) {
  const router = useRouter();
  const { startLoading, stopLoading } = useDashboardActionLoading();
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const en = english(locale);

  const current = useMemo(
    () => nuclei.find((nucleus) => nucleus.id === currentNucleusId),
    [currentNucleusId, nuclei],
  );

  useEffect(() => {
    function close(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const prefix =
    locale === "pt-BR" ? "" : localePrefix(locale as EnglishLocale);
  const currentSectionPath = financeSectionPath(currentSection, locale);

  function changeNucleus(id: string) {
    if (id === "__join__") {
      startLoading(
        locale === "pt-BR"
          ? "Abrindo solicitação de Núcleo..."
          : "Opening Nucleus request...",
      );
      router.push(
        `${joinNucleusPath(locale)}?household=${encodeURIComponent(currentNucleusId)}&month=${encodeURIComponent(selectedMonth)}`,
      );
      setOpen(false);
      return;
    }

    if (id === currentNucleusId) return;

    startLoading(en?.dashboard.changingNucleus ?? "Trocando de Núcleo...");
    router.push(
      `${currentSectionPath}?household=${encodeURIComponent(id)}&month=${encodeURIComponent(selectedMonth)}`,
    );
    setOpen(false);
  }

  function changeLanguage(nextLocale: AppLocale) {
    if (nextLocale === locale) return;

    startLoading(
      locale === "pt-BR"
        ? "Trocando idioma..."
        : "Switching language...",
    );

    const targetPath = financeSectionPath(currentSection, nextLocale);

    router.push(
      `${targetPath}?household=${encodeURIComponent(currentNucleusId)}&month=${encodeURIComponent(selectedMonth)}`,
    );
    setOpen(false);
  }

  async function logout() {
    setLoggingOut(true);
    startLoading(en?.dashboard.signingOut ?? "Saindo do AUREUM...");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        stopLoading();
        setLoggingOut(false);
        return;
      }

      router.replace(`${prefix}${locale === "pt-BR" ? "/entrar" : "/sign-in"}`);
      router.refresh();
    } catch {
      stopLoading();
      setLoggingOut(false);
    }
  }

  const returnParams = new URLSearchParams({
    household: currentNucleusId,
    month: selectedMonth,
  }).toString();

  const profilePath =
    locale === "pt-BR" ? "/perfil" : `${prefix}/profile`;
  const settingsPath =
    locale === "pt-BR" ? "/configuracoes" : `${prefix}/settings`;

  return (
    <div className={styles.profileWrap} ref={menuRef}>
      {open ? (
        <div className={styles.profileMenu}>
          <div className={styles.profileMenuIdentity}>
            <AccountAvatar name={userName} />
            <div>
              <strong>{userName}</strong>
              <small>{userEmail || en?.dashboard.profileSubtitle || "Conta AUREUM"}</small>
            </div>
          </div>

          <div className={styles.profileDivider} />

          <label className={styles.profileNucleus}>
            <span>{en?.dashboard.currentNucleus ?? "NÚCLEO ATUAL"}</span>
            <select
              onChange={(event) => changeNucleus(event.target.value)}
              value={currentNucleusId}
            >
              {nuclei.map((nucleus) => (
                <option key={nucleus.id} value={nucleus.id}>
                  {nucleus.name} — {nucleus.roleLabel}
                </option>
              ))}
              <option disabled value="__separator__">
                ────────────────
              </option>
              <option value="__join__">
                ＋ {locale === "pt-BR" ? "Adicionar Núcleo existente" : "Join existing Nucleus"}
              </option>
            </select>
          </label>

          <label className={styles.profileNucleus}>
            <span>{locale === "pt-BR" ? "IDIOMA" : "LANGUAGE"}</span>
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

          <div className={styles.profileNucleus}>
            <ThemeSelect compact locale={locale} />
          </div>

          <div className={styles.profileDivider} />

          <nav className={styles.profileLinks}>
            <Link
              href={`${profilePath}?${returnParams}`}
              onClick={() => {
                startLoading(
                  en?.dashboard.openPersonal ??
                    "Abrindo informações pessoais...",
                );
                setOpen(false);
              }}
            >
              <span>♙</span>
              <div>
                <strong>
                  {en?.common.personalInfo ?? "Informações pessoais"}
                </strong>
                <small>
                  {en?.dashboard.personalInfoDescription ??
                    "Nome, e-mail e dados da conta"}
                </small>
              </div>
            </Link>

            <Link
              href={`${settingsPath}?${returnParams}`}
              onClick={() => {
                startLoading(
                  en?.dashboard.openSettings ??
                    "Abrindo configurações...",
                );
                setOpen(false);
              }}
            >
              <span>⚙</span>
              <div>
                <strong>{en?.common.settings ?? "Configurações"}</strong>
                <small>
                  {en?.dashboard.settingsDescription ??
                    "Idioma, moeda e preferências"}
                </small>
              </div>
            </Link>
          </nav>

          <div className={styles.profileDivider} />

          <button
            className={styles.profileLogout}
            disabled={loggingOut}
            onClick={logout}
            type="button"
          >
            <span>↪</span>
            {loggingOut
              ? en?.dashboard.signingOut ?? "Saindo..."
              : en?.dashboard.signOutAureum ?? "Sair do AUREUM"}
          </button>
        </div>
      ) : null}

      <button
        aria-expanded={open}
        className={styles.profileButton}
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <AccountAvatar className={styles.profileAvatar} name={userName} />
        <span className={styles.profileButtonCopy}>
          <strong>{userName.split(/\s+/)[0] || userName}</strong>
          <small>
            {current?.name
              ? `${current.name} • ${current.roleLabel}`
              : userSubtitle}
          </small>
        </span>
        <span className={styles.profileChevron}>{open ? "⌃" : "⌄"}</span>
      </button>
    </div>
  );
}
