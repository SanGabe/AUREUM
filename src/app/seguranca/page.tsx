import { CTA, MarketingShell, PageHero, marketingStyles as styles } from "@/components/marketing-shell";

export const metadata = { title: "Segurança | AUREUM" };

const cards = [
  ["01","Isolamento por Núcleo","Row Level Security limita o acesso aos dados que pertencem aos Núcleos dos quais o usuário realmente faz parte."],
  ["02","Menor privilégio","Membros só recebem as permissões necessárias para seu papel. Acesso de leitura não vira acesso de edição por acidente."],
  ["03","Arquivos privados","Faturas e extratos devem permanecer privados, com acesso temporário e controlado quando necessário."],
  ["04","Revisão humana","Dados importados podem passar por conferência antes de serem incorporados ao histórico financeiro oficial."],
  ["05","Sem credenciais bancárias","O AUREUM não precisa armazenar senha de banco, CVV ou outros segredos desnecessários para funcionar."],
  ["06","Auditoria por origem","Lançamentos podem registrar se vieram da web, WhatsApp, importação, recorrência ou outra integração."],
];

export default function SegurancaPage() {
  return (
    <MarketingShell active="seguranca">
      <PageHero
        eyebrow="SEGURANÇA"
        title="Seu dinheiro merece contexto. Seus dados merecem limites."
        description="A segurança do AUREUM nasce na arquitetura: autenticação, isolamento por Núcleo, permissões e revisão antes de transformar informação em registro oficial."
      />
      <section className={styles.content}>
        <div className={styles.cards3}>
          {cards.map(([n,t,d]) => <article className={styles.card} key={t}><span className={styles.number}>{n}</span><h3>{t}</h3><p>{d}</p></article>)}
        </div>
      </section>
      <CTA />
    </MarketingShell>
  );
}
