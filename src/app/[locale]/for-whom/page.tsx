export const metadata = { title: "For whom" };

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

  const copy = getEnglishCopy(locale).marketing.forWhom;

  return (
    <EnglishMarketingShell active="for-whom" locale={locale}>
      <EnglishPageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
      />

      <section className={styles.content}>
        <div className={styles.cards3}>
          <article className={styles.card}><span className={styles.number}>PERSONAL</span><h3>Your money, your view</h3><p>Manage your own accounts, decisions and goals without depending on scattered spreadsheets.</p></article>
          <article className={styles.card}><span className={styles.number}>COUPLE</span><h3>One home, two people</h3><p>Share what should be shared while keeping individual responsibilities clear.</p></article>
          <article className={styles.card}><span className={styles.number}>FAMILY</span><h3>More people, clear rules</h3><p>Add members with different levels of access and preserve financial governance.</p></article>
        </div>

        <div className={styles.split}>
          <div className={styles.splitVisual}><img src="/brand/aureum-laurel-hq.png" alt="" /></div>
          <div className={styles.splitCopy}>
            <p className={styles.eyebrow}>NUCLEI</p>
            <h2>You can belong to more than one financial reality.</h2>
            <p>A person can have a personal Nucleus and also participate in a partner's, parents' or family's Nucleus. In AUREUM, access and ownership are different things.</p>
            <div className={styles.checks}>
              <div className={styles.check}><span>1</span><div><strong>Access up to 10 Nuclei</strong><p>Participate in different spaces without mixing data.</p></div></div>
              <div className={styles.check}><span>2</span><div><strong>Own up to 3</strong><p>Create and manage your own financial spaces.</p></div></div>
              <div className={styles.check}><span>3</span><div><strong>Role-based permissions</strong><p>Owner, administrator, financial contributor and member.</p></div></div>
            </div>
          </div>
        </div>
      </section>

      <EnglishCTA locale={locale} />
    </EnglishMarketingShell>
  );
}
