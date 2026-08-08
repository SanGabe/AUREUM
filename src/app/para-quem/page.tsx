import { CTA, MarketingShell, PageHero, marketingStyles as styles } from "@/components/marketing-shell";

export const metadata = { title: "Para quem" };

export default function ParaQuemPage() {
  return (
    <MarketingShell active="para-quem">
      <PageHero
        eyebrow="PARA QUEM"
        title="Finanças pessoais que também entendem relações."
        description="Use sozinho, em casal, com a família ou participando de diferentes Núcleos sem misturar responsabilidades."
      />

      <section className={styles.content}>
        <div className={styles.cards3}>
          <article className={styles.card}><span className={styles.number}>PESSOAL</span><h3>Seu dinheiro, sua visão</h3><p>Controle suas próprias contas, objetivos e decisões sem depender de planilhas espalhadas.</p></article>
          <article className={styles.card}><span className={styles.number}>CASAL</span><h3>Uma casa, duas pessoas</h3><p>Compartilhe o necessário e mantenha claras as responsabilidades de cada pessoa.</p></article>
          <article className={styles.card}><span className={styles.number}>FAMÍLIA</span><h3>Mais pessoas, regras claras</h3><p>Adicione membros com níveis de acesso diferentes e preserve a governança financeira.</p></article>
        </div>

        <div className={styles.split}>
          <div className={styles.splitVisual}><img src="/brand/aureum-laurel-hq.png" alt="" /></div>
          <div className={styles.splitCopy}>
            <p className={styles.eyebrow}>NÚCLEOS</p>
            <h2>Você pode pertencer a mais de uma realidade financeira.</h2>
            <p>Uma pessoa pode ter seu Núcleo pessoal e também participar do Núcleo de um parceiro, dos pais ou de outra família. No AUREUM, acesso e propriedade são coisas diferentes.</p>
            <div className={styles.checks}>
              <div className={styles.check}><span>1</span><div><strong>Até 10 Núcleos acessíveis</strong><p>Participe de diferentes espaços sem misturar dados.</p></div></div>
              <div className={styles.check}><span>2</span><div><strong>Até 3 como proprietário</strong><p>Crie e administre seus próprios Núcleos.</p></div></div>
              <div className={styles.check}><span>3</span><div><strong>Permissões por função</strong><p>Proprietário, administrador, colaborador financeiro e membro.</p></div></div>
            </div>
          </div>
        </div>
      </section>
      <CTA />
    </MarketingShell>
  );
}
