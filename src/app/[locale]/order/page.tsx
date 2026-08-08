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
    <EnglishMarketingShell active="order" locale={locale}>
      <section className={styles.content}>
        <div className={styles.pillarPageHero}>
          <img src="/brand/aureum-column-hq.png" alt="" />
          <h1>ORDO</h1>
          <h2>Order that creates freedom.</h2>
          <p>Organisation is not rigidity. It is a way to reduce noise so important decisions can be made with more clarity.</p>
        </div>
        <div className={styles.cards3}>
          <article className={styles.card}><span className={styles.number}>01</span><h3>Centralise</h3><p>Accounts, cards, transactions and goals stop living in disconnected places.</p></article>
          <article className={styles.card}><span className={styles.number}>02</span><h3>Classify</h3><p>Categories, sources and responsibilities turn entries into context.</p></article>
          <article className={styles.card}><span className={styles.number}>03</span><h3>Govern</h3><p>Permissions define who can view, propose or make financial information official.</p></article>
        </div>
      </section>
      <EnglishCTA locale={locale} />
    </EnglishMarketingShell>
  );
}
