import { MarketingShell, PageHero, marketingStyles as styles } from "@/components/marketing-shell";

export const metadata = { title: "Preços" };

export default function Page() {
  return (
    <MarketingShell>
      <PageHero eyebrow="PLANOS" title="Um plano proporcional à sua organização." description="Os limites e valores comerciais ainda estão em validação. Nenhuma cobrança será feita sem apresentação clara do plano e confirmação do usuário." />
      <section className={styles.content}>
        <div className={styles.cards3}>
          <article className={styles.card}><span className={styles.number}>01</span><h3>Essencial</h3><p>Organização pessoal, contas, categorias, metas e visão mensal.</p></article>
          <article className={styles.card}><span className={styles.number}>02</span><h3>Núcleo</h3><p>Colaboração, papéis, aprovações e organização compartilhada.</p></article>
          <article className={styles.card}><span className={styles.number}>03</span><h3>Automação</h3><p>Importações, WhatsApp e recursos avançados conforme disponibilidade.</p></article>
        </div>
      </section>
    </MarketingShell>
  );
}
