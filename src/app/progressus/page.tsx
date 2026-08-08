import { CTA, MarketingShell, marketingStyles as styles } from "@/components/marketing-shell";
export const metadata = { title: "Progressus | AUREUM" };
export default function Page() {
  return (
    <MarketingShell active="progressus">
      <section className={styles.content}>
        <div className={styles.pillarPageHero}>
          <img src="/brand/aureum-laurel-hq.png" alt="" />
          <h1>PROGRESSUS</h1>
          <h2>Evolução constante.</h2>
          <p>Progresso financeiro sustentável nasce de pequenas decisões repetidas, objetivos claros e feedback real sobre o caminho percorrido.</p>
        </div>
        <div className={styles.cards3}>
          <article className={styles.card}><span className={styles.number}>01</span><h3>Meça</h3><p>Acompanhe receitas, despesas, saldos e metas com dados reais.</p></article>
<article className={styles.card}><span className={styles.number}>02</span><h3>Aprenda</h3><p>Use o histórico para entender padrões e melhorar decisões futuras.</p></article>
<article className={styles.card}><span className={styles.number}>03</span><h3>Avance</h3><p>Converta clareza financeira em capacidade de realizar novos objetivos.</p></article>
        </div>
      </section>
      <CTA />
    </MarketingShell>
  );
}
