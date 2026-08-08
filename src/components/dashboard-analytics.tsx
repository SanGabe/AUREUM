"use client";

import { useMemo, useState } from "react";
import type { AppLocale } from "@/i18n/locales";
import { accountTypeLabel, categoryDisplayLabel, investmentClassLabel } from "@/lib/aureum/financial-labels";
import styles from "./dashboard-analytics.module.css";

export type AnalyticsMonth = {
  month: string;
  income: number;
  expenses: number;
  cashFlow: number;
  liquidBalance: number;
};

export type AnalyticsCategory = {
  name: string;
  systemCode?: string | null;
  total: number;
  percentage: number;
};

export type AnalyticsGroup = {
  key: string;
  value: number;
};

export type DashboardAnalyticsData = {
  currency: string;
  trackedAssets: number;
  cashValue: number;
  investmentValue: number;
  income: number;
  expenses: number;
  savings: number;
  savingsRate: number;
  monthly: AnalyticsMonth[];
  expenseCategories: AnalyticsCategory[];
  incomeCategories: AnalyticsCategory[];
  accountTypes: AnalyticsGroup[];
  investmentTypes: AnalyticsGroup[];
};

type AnalyticsView =
  | "overview"
  | "flow"
  | "categories"
  | "assets";

type DisplayMode = "charts" | "tables";

function money(
  value: number,
  currency: string,
  locale: AppLocale,
) {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(0)}`;
  }
}

function compactMoney(
  value: number,
  currency: string,
  locale: AppLocale,
) {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  } catch {
    return money(value, currency, locale);
  }
}

function monthLabel(value: string, locale: AppLocale) {
  if (!/^\d{4}-\d{2}$/.test(value)) return "—";

  const [year, month] = value.split("-").map(Number);

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    year: "2-digit",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

function labels(locale: AppLocale) {
  const pt = locale === "pt-BR";
  return {
    overview: pt ? "Visão geral" : "Overview",
    flow: pt ? "Fluxo" : "Cash flow",
    categories: pt ? "Categorias" : "Categories",
    assets: pt ? "Patrimônio" : "Assets",
    charts: pt ? "Gráficos" : "Charts",
    tables: pt ? "Tabelas" : "Tables",
    trackedAssets: pt ? "Patrimônio acompanhado" : "Tracked assets",
    income: pt ? "Receitas" : "Income",
    expenses: pt ? "Despesas" : "Expenses",
    savings: pt ? "Economia do período" : "Period savings",
    savingRate: pt ? "Taxa de economia" : "Savings rate",
    liquidBalance: pt ? "Evolução do saldo líquido" : "Liquid balance trend",
    incomeExpenses: pt ? "Receitas, despesas e fluxo de caixa" : "Income, expenses and cash flow",
    expensesByCategory: pt ? "Despesas por categoria" : "Expenses by category",
    incomeByCategory: pt ? "Receitas por origem" : "Income by source",
    allocation: pt ? "Composição do patrimônio acompanhado" : "Tracked asset allocation",
    accounts: pt ? "Contas" : "Accounts",
    investments: pt ? "Investimentos" : "Investments",
    monthlyTable: pt ? "Histórico mensal" : "Monthly history",
    month: pt ? "Mês" : "Month",
    cashFlow: pt ? "Fluxo líquido" : "Net cash flow",
    balance: pt ? "Saldo líquido" : "Liquid balance",
    noData: pt ? "Ainda não há dados suficientes para esta visualização." : "There is not enough data for this view yet.",
    accountTypes: pt ? "Contas por tipo" : "Accounts by type",
    investmentTypes: pt ? "Investimentos por classe" : "Investments by class",
  };
}

function AreaChart({
  data,
  locale,
  currency,
}: {
  data: AnalyticsMonth[];
  locale: AppLocale;
  currency: string;
}) {
  if (!data.length) return null;

  const width = 760;
  const height = 250;
  const paddingX = 34;
  const paddingY = 26;
  const values = data.map((item) => item.liquidBalance);
  const min = Math.min(0, ...values);
  const max = Math.max(1, ...values);
  const range = Math.max(1, max - min);

  const points = data.map((item, index) => {
    const x =
      paddingX +
      (index / Math.max(1, data.length - 1)) *
        (width - paddingX * 2);
    const y =
      height -
      paddingY -
      ((item.liquidBalance - min) / range) *
        (height - paddingY * 2);

    return { x, y, item };
  });

  const line = points
    .map((point) => `${point.x},${point.y}`)
    .join(" ");

  const area = [
    `${points[0].x},${height - paddingY}`,
    ...points.map((point) => `${point.x},${point.y}`),
    `${points.at(-1)!.x},${height - paddingY}`,
  ].join(" ");

  return (
    <div className={styles.svgChart}>
      <svg
        preserveAspectRatio="none"
        role="img"
        viewBox={`0 0 ${width} ${height}`}
      >
        {[0.25, 0.5, 0.75].map((ratio) => (
          <line
            className={styles.gridLine}
            key={ratio}
            x1={paddingX}
            x2={width - paddingX}
            y1={paddingY + ratio * (height - paddingY * 2)}
            y2={paddingY + ratio * (height - paddingY * 2)}
          />
        ))}

        <polygon
          className={styles.areaFill}
          points={area}
        />
        <polyline
          className={styles.balanceLine}
          points={line}
        />

        {points.map((point, index) => (
          <g key={point.item.month}>
            <circle
              className={styles.balanceDot}
              cx={point.x}
              cy={point.y}
              r="3.5"
            />
            {(index === 0 ||
              index === points.length - 1 ||
              index % Math.ceil(points.length / 6) === 0) && (
              <text
                className={styles.axisText}
                textAnchor="middle"
                x={point.x}
                y={height - 5}
              >
                {monthLabel(point.item.month, locale)}
              </text>
            )}
          </g>
        ))}
      </svg>

      <div className={styles.chartLegend}>
        <span className={styles.legendBalance} />
        {locale === "pt-BR" ? "Saldo líquido" : "Liquid balance"}
        <strong>
          {compactMoney(
            data.at(-1)?.liquidBalance ?? 0,
            currency,
            locale,
          )}
        </strong>
      </div>
    </div>
  );
}

function FlowChart({
  data,
  locale,
  currency,
}: {
  data: AnalyticsMonth[];
  locale: AppLocale;
  currency: string;
}) {
  if (!data.length) return null;

  const max = Math.max(
    1,
    ...data.flatMap((row) => [
      row.income,
      row.expenses,
      Math.abs(row.cashFlow),
    ]),
  );

  return (
    <div className={styles.flowChart}>
      <div className={styles.flowBars}>
        {data.map((row) => (
          <div className={styles.flowMonth} key={row.month}>
            <div className={styles.barArea}>
              <i
                className={styles.incomeBar}
                style={{
                  height: `${Math.max(
                    2,
                    (row.income / max) * 100,
                  )}%`,
                }}
                title={`${labels(locale).income}: ${money(
                  row.income,
                  currency,
                  locale,
                )}`}
              />
              <i
                className={styles.expenseBar}
                style={{
                  height: `${Math.max(
                    2,
                    (row.expenses / max) * 100,
                  )}%`,
                }}
                title={`${labels(locale).expenses}: ${money(
                  row.expenses,
                  currency,
                  locale,
                )}`}
              />
              <span
                className={
                  row.cashFlow >= 0
                    ? styles.cashFlowPositive
                    : styles.cashFlowNegative
                }
                style={{
                  bottom: `${Math.min(
                    94,
                    Math.max(
                      4,
                      (Math.abs(row.cashFlow) / max) * 100,
                    ),
                  )}%`,
                }}
                title={`${labels(locale).cashFlow}: ${money(
                  row.cashFlow,
                  currency,
                  locale,
                )}`}
              />
            </div>
            <small>{monthLabel(row.month, locale)}</small>
          </div>
        ))}
      </div>

      <div className={styles.chartLegend}>
        <span className={styles.legendIncome} />
        {labels(locale).income}
        <span className={styles.legendExpense} />
        {labels(locale).expenses}
        <span className={styles.legendCash} />
        {labels(locale).cashFlow}
      </div>
    </div>
  );
}

function HorizontalBars({
  rows,
  locale,
  currency,
}: {
  rows: AnalyticsCategory[];
  locale: AppLocale;
  currency: string;
}) {
  if (!rows.length) {
    return <div className={styles.noData}>{labels(locale).noData}</div>;
  }

  const max = Math.max(1, ...rows.map((row) => row.total));

  return (
    <div className={styles.horizontalBars}>
      {rows.slice(0, 8).map((row) => (
        <div className={styles.horizontalRow} key={`${row.systemCode}-${row.name}`}>
          <div>
            <strong>
              {categoryDisplayLabel(
                {
                  name: row.name,
                  systemCode: row.systemCode,
                },
                locale,
              )}
            </strong>
            <span>{money(row.total, currency, locale)}</span>
          </div>

          <div className={styles.horizontalTrack}>
            <i
              style={{
                width: `${Math.max(
                  2,
                  (row.total / max) * 100,
                )}%`,
              }}
            />
          </div>

          <small>{row.percentage.toFixed(0)}%</small>
        </div>
      ))}
    </div>
  );
}

function Donut({
  rows,
  locale,
  currency,
}: {
  rows: Array<{ label: string; value: number }>;
  locale: AppLocale;
  currency: string;
}) {
  const clean = rows.filter((row) => row.value > 0);
  const total = clean.reduce((sum, row) => sum + row.value, 0);

  if (!clean.length || total <= 0) {
    return <div className={styles.noData}>{labels(locale).noData}</div>;
  }

  const circumference = 2 * Math.PI * 42;
  let consumed = 0;

  return (
    <div className={styles.donutWrap}>
      <div className={styles.donut}>
        <svg viewBox="0 0 100 100">
          <circle
            className={styles.donutBase}
            cx="50"
            cy="50"
            r="42"
          />
          {clean.slice(0, 7).map((row, index) => {
            const share = row.value / total;
            const length = circumference * share;
            const offset = -consumed * circumference;
            consumed += share;

            return (
              <circle
                className={styles[`donut${index + 1}`]}
                cx="50"
                cy="50"
                key={row.label}
                r="42"
                strokeDasharray={`${length} ${circumference - length}`}
                strokeDashoffset={offset}
              />
            );
          })}
        </svg>

        <div>
          <strong>{compactMoney(total, currency, locale)}</strong>
          <small>{locale === "pt-BR" ? "total" : "total"}</small>
        </div>
      </div>

      <div className={styles.donutLegend}>
        {clean.slice(0, 7).map((row, index) => (
          <div key={row.label}>
            <i className={styles[`legend${index + 1}`]} />
            <span>{row.label}</span>
            <strong>
              {((row.value / total) * 100).toFixed(0)}%
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function MonthlyTable({
  data,
  locale,
  currency,
}: {
  data: AnalyticsMonth[];
  locale: AppLocale;
  currency: string;
}) {
  const t = labels(locale);

  return (
    <div className={styles.tableScroll}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>{t.month}</th>
            <th>{t.income}</th>
            <th>{t.expenses}</th>
            <th>{t.cashFlow}</th>
            <th>{t.balance}</th>
          </tr>
        </thead>
        <tbody>
          {[...data].reverse().map((row) => (
            <tr key={row.month}>
              <td>{monthLabel(row.month, locale)}</td>
              <td className={styles.positive}>
                {money(row.income, currency, locale)}
              </td>
              <td className={styles.negative}>
                {money(row.expenses, currency, locale)}
              </td>
              <td
                className={
                  row.cashFlow >= 0
                    ? styles.positive
                    : styles.negative
                }
              >
                {money(row.cashFlow, currency, locale)}
              </td>
              <td>
                {money(row.liquidBalance, currency, locale)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CategoryTable({
  rows,
  locale,
  currency,
}: {
  rows: AnalyticsCategory[];
  locale: AppLocale;
  currency: string;
}) {
  return (
    <div className={styles.tableScroll}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>{labels(locale).categories}</th>
            <th>{locale === "pt-BR" ? "Total" : "Total"}</th>
            <th>%</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.systemCode}-${row.name}`}>
              <td>
                {categoryDisplayLabel(
                  {
                    name: row.name,
                    systemCode: row.systemCode,
                  },
                  locale,
                )}
              </td>
              <td>{money(row.total, currency, locale)}</td>
              <td>{row.percentage.toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DashboardAnalytics({
  data,
  locale,
  showKpis = true,
}: {
  data: DashboardAnalyticsData;
  locale: AppLocale;
  showKpis?: boolean;
}) {
  const [view, setView] =
    useState<AnalyticsView>("overview");
  const [display, setDisplay] =
    useState<DisplayMode>("charts");
  const t = labels(locale);

  const assetRows = useMemo(
    () => [
      {
        label: t.accounts,
        value: Math.max(0, data.cashValue),
      },
      {
        label: t.investments,
        value: Math.max(0, data.investmentValue),
      },
    ],
    [data.cashValue, data.investmentValue, t.accounts, t.investments],
  );

  const accountRows = useMemo(
    () =>
      data.accountTypes.map((row) => ({
        label: accountTypeLabel(row.key, locale),
        value: row.value,
      })),
    [data.accountTypes, locale],
  );

  const investmentRows = useMemo(
    () =>
      data.investmentTypes.map((row) => ({
        label: investmentClassLabel(row.key, locale),
        value: row.value,
      })),
    [data.investmentTypes],
  );

  return (
    <section className={styles.analytics}>
      <header className={styles.analyticsToolbar}>
        <div className={styles.viewTabs}>
          {(
            [
              ["overview", t.overview],
              ["flow", t.flow],
              ["categories", t.categories],
              ["assets", t.assets],
            ] as Array<[AnalyticsView, string]>
          ).map(([key, label]) => (
            <button
              aria-pressed={view === key}
              className={
                view === key ? styles.activeTab : ""
              }
              key={key}
              onClick={() => setView(key)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        <div className={styles.displayTabs}>
          <button
            aria-pressed={display === "charts"}
            className={
              display === "charts" ? styles.activeDisplay : ""
            }
            onClick={() => setDisplay("charts")}
            type="button"
          >
            ◫ {t.charts}
          </button>
          <button
            aria-pressed={display === "tables"}
            className={
              display === "tables" ? styles.activeDisplay : ""
            }
            onClick={() => setDisplay("tables")}
            type="button"
          >
            ≡ {t.tables}
          </button>
        </div>
      </header>

      {showKpis ? (
        <div className={styles.kpis}>
        <article>
          <span>{t.trackedAssets}</span>
          <strong>
            {money(data.trackedAssets, data.currency, locale)}
          </strong>
          <small>
            {t.accounts} + {t.investments}
          </small>
        </article>
        <article>
          <span>{t.income}</span>
          <strong className={styles.positive}>
            {money(data.income, data.currency, locale)}
          </strong>
          <small>{monthLabel(data.monthly.at(-1)?.month ?? "", locale)}</small>
        </article>
        <article>
          <span>{t.expenses}</span>
          <strong className={styles.negative}>
            {money(data.expenses, data.currency, locale)}
          </strong>
          <small>{monthLabel(data.monthly.at(-1)?.month ?? "", locale)}</small>
        </article>
        <article>
          <span>{t.savings}</span>
          <strong
            className={
              data.savings >= 0
                ? styles.positive
                : styles.negative
            }
          >
            {money(data.savings, data.currency, locale)}
          </strong>
          <small>
            {t.savingRate}: {data.savingsRate.toFixed(1)}%
          </small>
        </article>
        </div>
      ) : null}

      {display === "tables" ? (
        <div className={styles.tableGrid}>
          <article className={styles.analyticsCard}>
            <header>
              <span>{t.monthlyTable}</span>
            </header>
            <MonthlyTable
              currency={data.currency}
              data={data.monthly}
              locale={locale}
            />
          </article>

          <article className={styles.analyticsCard}>
            <header>
              <span>{t.expensesByCategory}</span>
            </header>
            <CategoryTable
              currency={data.currency}
              locale={locale}
              rows={data.expenseCategories}
            />
          </article>

          <article className={styles.analyticsCard}>
            <header>
              <span>{t.incomeByCategory}</span>
            </header>
            <CategoryTable
              currency={data.currency}
              locale={locale}
              rows={data.incomeCategories}
            />
          </article>
        </div>
      ) : view === "overview" ? (
        <div className={styles.analyticsGrid}>
          <article
            className={`${styles.analyticsCard} ${styles.span2}`}
          >
            <header>
              <span>{t.liquidBalance}</span>
            </header>
            <AreaChart
              currency={data.currency}
              data={data.monthly.slice(-12)}
              locale={locale}
            />
          </article>

          <article
            className={`${styles.analyticsCard} ${styles.span2}`}
          >
            <header>
              <span>{t.incomeExpenses}</span>
            </header>
            <FlowChart
              currency={data.currency}
              data={data.monthly.slice(-12)}
              locale={locale}
            />
          </article>

          <article className={styles.analyticsCard}>
            <header>
              <span>{t.allocation}</span>
            </header>
            <Donut
              currency={data.currency}
              locale={locale}
              rows={assetRows}
            />
          </article>

          <article className={styles.analyticsCard}>
            <header>
              <span>{t.expensesByCategory}</span>
            </header>
            <HorizontalBars
              currency={data.currency}
              locale={locale}
              rows={data.expenseCategories}
            />
          </article>
        </div>
      ) : view === "flow" ? (
        <div className={styles.analyticsGrid}>
          <article
            className={`${styles.analyticsCard} ${styles.span2}`}
          >
            <header>
              <span>{t.incomeExpenses}</span>
            </header>
            <FlowChart
              currency={data.currency}
              data={data.monthly}
              locale={locale}
            />
          </article>

          <article className={styles.analyticsCard}>
            <header>
              <span>{t.incomeByCategory}</span>
            </header>
            <HorizontalBars
              currency={data.currency}
              locale={locale}
              rows={data.incomeCategories}
            />
          </article>

          <article className={styles.analyticsCard}>
            <header>
              <span>{t.expensesByCategory}</span>
            </header>
            <HorizontalBars
              currency={data.currency}
              locale={locale}
              rows={data.expenseCategories}
            />
          </article>
        </div>
      ) : view === "categories" ? (
        <div className={styles.analyticsGrid}>
          <article
            className={`${styles.analyticsCard} ${styles.span2}`}
          >
            <header>
              <span>{t.expensesByCategory}</span>
            </header>
            <HorizontalBars
              currency={data.currency}
              locale={locale}
              rows={data.expenseCategories}
            />
          </article>

          <article
            className={`${styles.analyticsCard} ${styles.span2}`}
          >
            <header>
              <span>{t.incomeByCategory}</span>
            </header>
            <HorizontalBars
              currency={data.currency}
              locale={locale}
              rows={data.incomeCategories}
            />
          </article>
        </div>
      ) : (
        <div className={styles.analyticsGrid}>
          <article className={styles.analyticsCard}>
            <header>
              <span>{t.accountTypes}</span>
            </header>
            <Donut
              currency={data.currency}
              locale={locale}
              rows={accountRows}
            />
          </article>

          <article className={styles.analyticsCard}>
            <header>
              <span>{t.investmentTypes}</span>
            </header>
            <Donut
              currency={data.currency}
              locale={locale}
              rows={investmentRows}
            />
          </article>

          <article
            className={`${styles.analyticsCard} ${styles.span2}`}
          >
            <header>
              <span>{t.liquidBalance}</span>
            </header>
            <AreaChart
              currency={data.currency}
              data={data.monthly}
              locale={locale}
            />
          </article>
        </div>
      )}
    </section>
  );
}
