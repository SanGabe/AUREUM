import { MarketingShell, PageHero, marketingStyles as styles } from "@/components/marketing-shell";

export const metadata = { title: "Central de ajuda" };

export default function Page() {
  const items = [
    ["Conta e acesso", "Cadastro, confirmação de e-mail, senha, perfil e encerramento."],
    ["Núcleos financeiros", "Criação, solicitação por código, papéis e aprovações."],
    ["Contas e lançamentos", "Contas, cartões, categorias, transações e moedas."],
    ["Importações", "Arquivos aceitos, duplicidades, revisão e privacidade dos documentos."],
    ["WhatsApp", "Associação segura, códigos temporários e recebimento de documentos."],
    ["Privacidade", "Direitos, segurança, retenção e canais de solicitação."],
  ];
  return <MarketingShell><PageHero eyebrow="AJUDA" title="Respostas claras para cada etapa." description="A central está sendo preparada junto com os fluxos do produto. Os tópicos abaixo definem sua estrutura inicial." /><section className={styles.content}><div className={styles.cards3}>{items.map(([title, body], index) => <article className={styles.card} key={title}><span className={styles.number}>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{body}</p></article>)}</div></section></MarketingShell>;
}
