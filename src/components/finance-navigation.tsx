import Link from "next/link";
import type { AppLocale, EnglishLocale } from "@/i18n/locales";
import { localePrefix } from "@/i18n/locales";
import styles from "./dashboard-view.module.css";

export type FinanceSection =
  | "dashboard"
  | "transactions"
  | "categories"
  | "goals"
  | "accounts"
  | "investments"
  | "exchange-rates"
  | "approvals";

const PT_PATHS: Record<FinanceSection, string> = {
  dashboard: "/dashboard",
  transactions: "/transacoes",
  categories: "/categorias",
  goals: "/metas",
  accounts: "/contas",
  investments: "/investimentos",
  "exchange-rates": "/cotacoes",
  approvals: "/aprovacoes",
};

const EN_PATHS: Record<FinanceSection, string> = {
  dashboard: "/dashboard",
  transactions: "/transactions",
  categories: "/categories",
  goals: "/goals",
  accounts: "/accounts",
  investments: "/investments",
  "exchange-rates": "/exchange-rates",
  approvals: "/approvals",
};

export function financeSectionPath(
  section: FinanceSection,
  locale: AppLocale,
) {
  if (locale === "pt-BR") return PT_PATHS[section];

  return `${localePrefix(locale as EnglishLocale)}${EN_PATHS[section]}`;
}

export function joinNucleusPath(locale: AppLocale) {
  if (locale === "pt-BR") return "/nucleos/adicionar";
  return `${localePrefix(locale as EnglishLocale)}/nuclei/join`;
}

function labels(locale: AppLocale) {
  if (locale === "pt-BR") {
    return {
      dashboard: "Resumo",
      transactions: "Transações",
      categories: "Categorias",
      goals: "Metas",
      accounts: "Contas & Bancos",
      investments: "Investimentos",
      "exchange-rates": "Cotações",
      approvals: "Aprovações",
    } satisfies Record<FinanceSection, string>;
  }

  return {
    dashboard: "Overview",
    transactions: "Transactions",
    categories: "Categories",
    goals: "Goals",
    accounts: "Accounts & Banks",
    investments: "Investments",
    "exchange-rates": "Exchange rates",
    approvals: "Approvals",
  } satisfies Record<FinanceSection, string>;
}

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

export function FinanceNavigation({
  active,
  householdId,
  locale,
  month,
  demo = false,
}: {
  active: FinanceSection;
  householdId?: string;
  locale: AppLocale;
  month?: string;
  demo?: boolean;
}) {
  const text = labels(locale);

  if (demo) {
    return (
      <nav className={styles.sidebarNav}>
        <a className={styles.activeLink} href="#resumo">
          <span>{ICONS.dashboard}</span>
          {text.dashboard}
        </a>
        <a href="#transacoes">
          <span>{ICONS.transactions}</span>
          {text.transactions}
        </a>
        <a href="#categorias">
          <span>{ICONS.categories}</span>
          {text.categories}
        </a>
        <a href="#metas">
          <span>{ICONS.goals}</span>
          {text.goals}
        </a>
      </nav>
    );
  }

  const query = new URLSearchParams();
  if (householdId) query.set("household", householdId);
  if (month) query.set("month", month);
  const suffix = query.toString() ? `?${query.toString()}` : "";

  const sections: FinanceSection[] = [
    "dashboard",
    "transactions",
    "categories",
    "goals",
    "accounts",
    "investments",
    "exchange-rates",
    "approvals",
  ];

  return (
    <nav className={styles.sidebarNav}>
      {sections.map((section) => (
        <Link
          className={active === section ? styles.activeLink : ""}
          href={`${financeSectionPath(section, locale)}${suffix}`}
          key={section}
        >
          <span>{ICONS[section]}</span>
          {text[section]}
        </Link>
      ))}
    </nav>
  );
}
