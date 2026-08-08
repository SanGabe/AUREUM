import { notFound } from "next/navigation";
import {
  EnglishCTA,
  EnglishMarketingShell,
  englishMarketingStyles as styles,
} from "@/components/english-marketing-shell";
import { parseEnglishLocale } from "@/i18n/locales";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: segment } = await params;
  const locale = parseEnglishLocale(segment);
  if (!locale) notFound();

  return (
    <EnglishMarketingShell active="progress" locale={locale}>
      <section className={styles.content}>
        <div className={styles.pillarPageHero}>
          <img src="/brand/aureum-laurel-hq.png" alt="" />
          <h1>PROGRESSUS</h1>
          <h2>Continuous progress.</h2>
          <p>Sustainable financial progress grows from small repeated decisions, clear objectives and honest feedback about the path already travelled.</p>
        </div>
        <div className={styles.cards3}>
          <article className={styles.card}><span className={styles.number}>01</span><h3>Measure</h3><p>Follow income, expenses, balances and goals with real data.</p></article>
          <article className={styles.card}><span className={styles.number}>02</span><h3>Learn</h3><p>Use history to understand patterns and improve future decisions.</p></article>
          <article className={styles.card}><span className={styles.number}>03</span><h3>Advance</h3><p>Turn financial clarity into greater capacity to achieve new goals.</p></article>
        </div>
      </section>
      <EnglishCTA locale={locale} />
    </EnglishMarketingShell>
  );
}
