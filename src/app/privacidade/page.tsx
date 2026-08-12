import { LegalDocument } from "@/components/legal-document";
import { MarketingShell, PageHero } from "@/components/marketing-shell";

export const metadata = { title: "Privacidade e LGPD" };

export default function Page() {
  return <MarketingShell><PageHero eyebrow="PRIVACIDADE E LGPD" title="Dados financeiros exigem propósito, limites e transparência." description="Conheça as categorias de dados, finalidades, controles e direitos considerados no AUREUM." /><LegalDocument kind="privacy" /></MarketingShell>;
}
