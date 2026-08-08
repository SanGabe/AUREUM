export const metadata = { title: "Security" };

import { notFound } from "next/navigation";
import {
  EnglishCTA,
  EnglishMarketingShell,
  EnglishPageHero,
  englishMarketingStyles as styles,
} from "@/components/english-marketing-shell";
import { getEnglishCopy } from "@/i18n/english-copy";
import { parseEnglishLocale } from "@/i18n/locales";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: segment } = await params;
  const locale = parseEnglishLocale(segment);
  if (!locale) notFound();

  const copy = getEnglishCopy(locale).marketing.security;
  const cards = [
    ["01", "Isolation by Nucleus", "Row Level Security limits access to data that belongs to Nuclei the user actually participates in."],
    ["02", "Least privilege", "Members only receive the permissions required by their role."],
    ["03", "Private files", "Bills and statements remain private and should only be exposed through controlled, temporary access."],
    ["04", "Human review", "Imported data can be reviewed before it becomes part of the official financial history."],
    ["05", "No banking passwords", "AUREUM does not need bank passwords, CVVs or unnecessary secrets to provide its core functionality."],
    ["06", "Source auditing", "Entries can identify whether they came from web, WhatsApp, imports, recurrence or another integration."],
  ];

  return (
    <EnglishMarketingShell active="security" locale={locale}>
      <EnglishPageHero eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />
      <section className={styles.content}>
        <div className={styles.cards3}>
          {cards.map(([n,t,d]) => <article className={styles.card} key={t}><span className={styles.number}>{n}</span><h3>{t}</h3><p>{d}</p></article>)}
        </div>
      </section>
      <EnglishCTA locale={locale} />
    </EnglishMarketingShell>
  );
}
