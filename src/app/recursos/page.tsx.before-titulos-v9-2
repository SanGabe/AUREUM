import Link from "next/link";
import { CTA, MarketingShell, PageHero, marketingStyles as styles } from "@/components/marketing-shell";

export const metadata = { title: "Recursos | AUREUM" };

const items = [
  ["01", "Contas em um só lugar", "Organize conta corrente, carteira, poupança e investimentos por Núcleo e moeda."],
  ["02", "Cartões sem confusão", "Acompanhe cartões e gastos sem duplicar a despesa quando a fatura for paga."],
  ["03", "Transações com contexto", "Receitas, despesas, transferências, categorias, origem e histórico de cada lançamento."],
  ["04", "Metas e patrimônio", "Transforme objetivos em números claros e acompanhe sua evolução."],
  ["05", "Importação assistida", "Faturas e extratos entram para revisão antes de se tornarem dados financeiros oficiais."],
  ["06", "Núcleos e permissões", "Compartilhe a vida financeira com regras claras para proprietário, administrador, colaborador e membro."],
];

export default function RecursosPage() {
  return (
    <MarketingShell active="recursos">
      <PageHero
        eyebrow="PRODUTO"
        title="Uma visão financeira. Todos os contextos."
        description="O AUREUM reúne o que normalmente fica espalhado entre bancos, cartões, planilhas, mensagens e anotações."
      >
        <div className={styles.heroActions}>
          <Link className={styles.primaryButton} href="/cadastrar">Começar agora →</Link>
          <Link className={styles.secondarySmall} href="/demonstracao">Ver demonstração</Link>
        </div>
      </PageHero>

      <section className={styles.content}>
        <div className={styles.intro}>
          <p className={styles.eyebrow}>RECURSOS</p>
          <h2>Menos trabalho para registrar. Mais clareza para decidir.</h2>
        </div>

        <div className={styles.cards3}>
          {items.map(([n,t,d]) => (
            <article className={styles.card} key={t}>
              <span className={styles.number}>{n}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </article>
          ))}
        </div>

        <div className={styles.split}>
          <div className={styles.splitVisual}><img src="/brand/aureum-emblem-hq.png" alt="" /></div>
          <div className={styles.splitCopy}>
            <p className={styles.eyebrow}>UNIFICADO DE VERDADE</p>
            <h2>O AUREUM não quer ser outra planilha bonita.</h2>
            <p>Ele foi pensado como uma camada única de organização: o dado entra por diferentes caminhos, passa por validação e aparece no mesmo contexto financeiro.</p>
            <div className={styles.checks}>
              <div className={styles.check}><span>✓</span><div><strong>Web como centro de controle</strong><p>Revisão, gestão de Núcleos e análise em uma interface completa.</p></div></div>
              <div className={styles.check}><span>✓</span><div><strong>WhatsApp para velocidade</strong><p>Registro e consulta rápida sem transformar a conversa no banco principal.</p></div></div>
              <div className={styles.check}><span>✓</span><div><strong>Google Sheets como integração</strong><p>Exportação e espelhamento quando você realmente precisar de uma planilha.</p></div></div>
            </div>
          </div>
        </div>
      </section>
      <CTA />
    </MarketingShell>
  );
}
