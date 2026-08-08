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

  const copy = getEnglishCopy(locale).marketing.about;
  const prefix = localePrefix(locale);

  return (
    <EnglishMarketingShell active="about" locale={locale}>
      <EnglishPageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        asset="/brand/aureum-seal.png"
      />

      <section className={styles.content}>
        <div className={styles.split}>
          <div className={styles.splitVisual}><img src="/brand/aureum-logo-motto-hq.png" alt="AUREUM" /></div>
          <div className={styles.splitCopy}>
            <p className={styles.eyebrow}>{copy.ideaEyebrow}</p>
            <h2>{copy.ideaTitle}</h2>
            <p>{copy.ideaText}</p>
          </div>
        </div>

        <div className={styles.cards3}>
          <Link className={styles.card} href={`${prefix}/love`}><span className={styles.number}>AMOR</span><h3>Care for what matters</h3><p>Finance as a tool to protect people, objectives and choices.</p></Link>
          <Link className={styles.card} href={`${prefix}/order`}><span className={styles.number}>ORDO</span><h3>Order that creates freedom</h3><p>Method, structure and clarity to reduce improvisation.</p></Link>
          <Link className={styles.card} href={`${prefix}/progress`}><span className={styles.number}>PROGRESSUS</span><h3>Continuous progress</h3><p>Better decisions today to create more possibilities tomorrow.</p></Link>
        </div>
      </section>

      <EnglishCTA locale={locale} />
    </EnglishMarketingShell>
  );
}
