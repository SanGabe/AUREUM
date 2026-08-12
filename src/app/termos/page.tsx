import { LegalDocument } from "@/components/legal-document";
import { MarketingShell, PageHero } from "@/components/marketing-shell";

export const metadata = { title: "Termos de uso" };

export default function Page() {
  return <MarketingShell><PageHero eyebrow="TERMOS" title="Regras claras para uma relação de confiança." description="Condições de uso, responsabilidades e limites do AUREUM." /><LegalDocument kind="terms" /></MarketingShell>;
}
