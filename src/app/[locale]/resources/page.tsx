export const metadata = { title: "Resources" };

import Link from "next/link";
import { notFound } from "next/navigation";
import {
  EnglishCTA,
  EnglishMarketingShell,
  EnglishPageHero,
  englishMarketingStyles as styles,
} from "@/components/english-marketing-shell";
import { getEnglishCopy } from "@/i18n/english-copy";
import { localePrefix, parseEnglishLocale } from "@/i18n/locales";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: segment } = await params;
  const locale = parseEnglishLocale(segment);
  if (!locale) notFound();

  const t = getEnglishCopy(locale);
  const copy = t.marketing.resources;
  const prefix = localePrefix(locale);

  return (
    <EnglishMarketingShell active="resources" locale={locale}>
      <EnglishPageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
      >
        <div className={styles.heroActions}>
          <Link className={styles.primaryButton} href={`${prefix}/sign-up`}>
            Get started →
          </Link>
          <Link className={styles.secondarySmall} href={`${prefix}/demo`}>
            View demo
          </Link>
        </div>
      </EnglishPageHero>

      <section className={styles.content}>
        <div className={styles.intro}>
          <p className={styles.eyebrow}>FEATURES</p>
          <h2>{copy.sectionTitle}</h2>
        </div>

        <div className={styles.cards3}>
          {copy.cards.map(([number, title, description]) => (
            <article className={styles.card} key={title}>
              <span className={styles.number}>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>

        <div className={styles.split}>
          <div className={styles.splitVisual}>
            <img src="/brand/aureum-emblem-hq.png" alt="" />
          </div>
          <div className={styles.splitCopy}>
            <p className={styles.eyebrow}>TRULY UNIFIED</p>
            <h2>AUREUM is not trying to become another pretty spreadsheet.</h2>
            <p>
              Information can arrive through different channels, pass through
              validation and still end up in one coherent financial context.
            </p>
            <div className={styles.checks}>
              <div className={styles.check}><span>✓</span><div><strong>Web as the control centre</strong><p>Review, Nucleus management and analysis in one complete interface.</p></div></div>
              <div className={styles.check}><span>✓</span><div><strong>WhatsApp for speed</strong><p>Quick capture and queries without turning chat into your source of truth.</p></div></div>
              <div className={styles.check}><span>✓</span><div><strong>Google Sheets as an integration</strong><p>Export or mirror data when a spreadsheet is genuinely useful.</p></div></div>
            </div>
          </div>
        </div>
      </section>

      <EnglishCTA locale={locale} />
    </EnglishMarketingShell>
  );
}
