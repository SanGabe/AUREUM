export const metadata = { title: "Love" };

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
    <EnglishMarketingShell active="love" locale={locale}>
      <section className={styles.content}>
        <div className={styles.pillarPageHero}>
          <img src="/brand/aureum-heart-hq.png" alt="" />
          <h1>AMOR</h1>
          <h2>Care for what matters.</h2>
          <p>Money is not the destination. It is a tool for protecting choices, achieving objectives and building peace of mind with the people who matter.</p>
        </div>
        <div className={styles.cards3}>
          <article className={styles.card}><span className={styles.number}>01</span><h3>Protect priorities</h3><p>Separate essentials from impulses and keep important goals visible.</p></article>
          <article className={styles.card}><span className={styles.number}>02</span><h3>Share with respect</h3><p>A Nucleus allows collaboration without erasing individual boundaries.</p></article>
          <article className={styles.card}><span className={styles.number}>03</span><h3>Plan the future</h3><p>Turn aspirations into financial goals you can actually follow.</p></article>
        </div>
      </section>
      <EnglishCTA locale={locale} />
    </EnglishMarketingShell>
  );
}
