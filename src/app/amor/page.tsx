import { CTA, MarketingShell, marketingStyles as styles } from "@/components/marketing-shell";
export const metadata = { title: "Amor" };
export default function Page() {
  return (
    <MarketingShell active="amor">
      <section className={styles.content}>
        <div className={styles.pillarPageHero}>
          <img src="/brand/aureum-heart-hq.png" alt="" />
          <h1>AMOR</h1>
          <h2>Cuidar do que importa.</h2>
          <p>Dinheiro não é o fim. É uma ferramenta para proteger escolhas, realizar objetivos e construir tranquilidade com quem importa.</p>
        </div>
        <div className={styles.cards3}>
          <article className={styles.card}><span className={styles.number}>01</span><h3>Proteja prioridades</h3><p>Separe o essencial do impulso e mantenha seus objetivos visíveis.</p></article>
<article className={styles.card}><span className={styles.number}>02</span><h3>Compartilhe com respeito</h3><p>Uma Household permite colaboração sem eliminar limites individuais.</p></article>
<article className={styles.card}><span className={styles.number}>03</span><h3>Planeje o futuro</h3><p>Transforme desejos em metas financeiras acompanháveis.</p></article>
        </div>
      </section>
      <CTA />
    </MarketingShell>
  );
}
