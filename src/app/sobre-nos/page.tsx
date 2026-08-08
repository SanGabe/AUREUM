import Link from "next/link";
import { CTA, MarketingShell, PageHero, marketingStyles as styles } from "@/components/marketing-shell";

export const metadata = { title: "Sobre nós | AUREUM" };

export default function SobreNosPage() {
  return (
    <MarketingShell active="sobre-nos">
      <PageHero
        eyebrow="NOSSA HISTÓRIA"
        title="Valor, ordem e progresso em uma identidade brasileira."
        description="AUREUM nasce da ideia de organizar o presente para dar direção ao futuro — com referências clássicas, símbolos brasileiros e tecnologia."
        asset="/brand/aureum-seal.png"
      />

      <section className={styles.content}>
        <div className={styles.split}>
          <div className={styles.splitVisual}><img src="/brand/aureum-logo-motto-hq.png" alt="AUREUM" /></div>
          <div className={styles.splitCopy}>
            <p className={styles.eyebrow}>O NOME</p>
            <h2>O valor do AU. O poder de UM.</h2>
            <p><strong>AU</strong> remete ao símbolo químico do ouro: valor, patrimônio e solidez. <strong>UM</strong> traduz o objetivo do produto: reunir sua vida financeira em um único lugar.</p>
          </div>
        </div>

        <div className={styles.cards3}>
          <Link className={styles.card} href="/amor"><span className={styles.number}>AMOR</span><h3>Cuidar do que importa</h3><p>Finanças como ferramenta para proteger pessoas, objetivos e escolhas.</p></Link>
          <Link className={styles.card} href="/ordo"><span className={styles.number}>ORDO</span><h3>Ordem que gera liberdade</h3><p>Método, estrutura e clareza para reduzir improviso.</p></Link>
          <Link className={styles.card} href="/progressus"><span className={styles.number}>PROGRESSUS</span><h3>Evolução constante</h3><p>Decisões melhores hoje para construir mais possibilidades amanhã.</p></Link>
        </div>
      </section>
      <CTA />
    </MarketingShell>
  );
}
