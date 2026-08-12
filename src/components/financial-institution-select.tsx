import type { AppLocale } from "@/i18n/locales";
import { FINANCIAL_INSTITUTIONS } from "@/lib/aureum/financial-institutions";

export function FinancialInstitutionSelect({ name = "institution", locale }: { name?: string; locale: AppLocale }) {
  const pt = locale === "pt-BR";
  const local = FINANCIAL_INSTITUTIONS.filter((item) => item.country === "BR");
  const international = FINANCIAL_INSTITUTIONS.filter((item) => item.country !== "BR");
  return (
    <select name={name} defaultValue="">
      <option value="">{pt ? "Selecione uma instituição" : "Select an institution"}</option>
      <optgroup label={pt ? "Brasil" : "Brazil"}>
        {local.map((item) => <option value={item.name} key={item.id}>{item.name}</option>)}
      </optgroup>
      <optgroup label={pt ? "Internacionais" : "International"}>
        {international.map((item) => <option value={item.name} key={item.id}>{item.name} · {item.country}</option>)}
      </optgroup>
      <option value="Outra instituição">{pt ? "Outra instituição" : "Other institution"}</option>
    </select>
  );
}
