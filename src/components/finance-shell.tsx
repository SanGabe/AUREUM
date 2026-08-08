import Link from "next/link";
import type { ReactNode } from "react";
import { DashboardActionLoadingProvider } from "@/components/dashboard-action-loading";
import { MonthNavigator, ProfileMenu } from "@/components/dashboard-controls";
import {
  FinanceNavigation,
  type FinanceSection,
} from "@/components/finance-navigation";
import type { FinanceContext } from "@/lib/aureum/finance-context";
import { roleLabel } from "@/lib/aureum/finance-context";
import { MobileFinanceNav } from "@/components/mobile-finance-nav";
import type { AppLocale } from "@/i18n/locales";
import styles from "./dashboard-view.module.css";
import pageStyles from "./finance-page.module.css";

export function FinanceShell({
  active,
  children,
  context,
  description,
  eyebrow,
  showMonth = false,
  title,
}: {
  active: FinanceSection;
  children: ReactNode;
  context: FinanceContext;
  description: string;
  eyebrow?: string;
  showMonth?: boolean;
  title: string;
}) {
  const locale: AppLocale = context.locale;

  return (
    <DashboardActionLoadingProvider locale={locale}>
      <main className={styles.shell} lang={locale}>
        <aside className={styles.sidebar}>
          <Link className={styles.brand} href={locale === "pt-BR" ? "/" : `/${locale.toLowerCase()}`}>
            <img src="/brand/aureum-logo-motto-hq.png" alt="AUREUM" />
          </Link>

          <FinanceNavigation
            active={active}
            householdId={context.nucleus.id}
            locale={locale}
            month={context.selectedMonth}
          />

          <ProfileMenu
            currentNucleusId={context.nucleus.id}
            currentSection={active}
            nuclei={context.nuclei.map((nucleus) => ({
              id: nucleus.id,
              name: nucleus.name,
              roleLabel: roleLabel(
                context.memberships.find(
                  (membership) =>
                    membership.household_id === nucleus.id,
                )?.role ?? "viewer",
                locale,
              ),
            }))}
            selectedMonth={context.selectedMonth}
            userEmail={context.user.email}
            userName={context.userName}
            userSubtitle={`${context.nucleus.name} • ${roleLabel(context.role, locale)}`}
            locale={locale}
          />
        </aside>

        <MobileFinanceNav
          active={active}
          currentNucleusId={context.nucleus.id}
          locale={locale}
          month={context.selectedMonth}
          nuclei={context.nuclei.map((nucleus) => ({
            id: nucleus.id,
            name: nucleus.name,
            roleLabel: roleLabel(
              context.memberships.find(
                (membership) =>
                  membership.household_id === nucleus.id,
              )?.role ?? "viewer",
              locale,
            ),
          }))}
          userName={context.userName}
        />

        <section className={styles.content}>
          <header className={pageStyles.pageHeader}>
            <div>
              <p className={pageStyles.eyebrow}>{eyebrow ?? "AUREUM"}</p>
              <h1>{title}</h1>
              <p>{description}</p>
            </div>

            <span className={pageStyles.nucleusBadge}>
              {context.nucleus.name}
            </span>
          </header>

          {showMonth ? (
            <div className={styles.periodBar}>
              <MonthNavigator
                currentNucleusId={context.nucleus.id}
                selectedMonth={context.selectedMonth}
                locale={locale}
                dashboardPath={
                  active === "dashboard"
                    ? locale === "pt-BR"
                      ? "/dashboard"
                      : `/${locale.toLowerCase()}/dashboard`
                    : undefined
                }
                currentSection={active}
              />
            </div>
          ) : null}

          {children}
        </section>
      </main>
    </DashboardActionLoadingProvider>
  );
}
