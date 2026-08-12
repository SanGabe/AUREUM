export type FinancialInstitution = {
  id: string;
  name: string;
  country: string;
  kind: "bank" | "credit-union" | "broker" | "fintech" | "payments" | "international";
  aliases?: string[];
};

export const FINANCIAL_INSTITUTIONS: FinancialInstitution[] = [
  { id: "nubank", name: "Nubank", country: "BR", kind: "fintech" },
  { id: "itau", name: "Itaú Unibanco", country: "BR", kind: "bank", aliases: ["Itaú"] },
  { id: "bradesco", name: "Bradesco", country: "BR", kind: "bank" },
  { id: "banco-do-brasil", name: "Banco do Brasil", country: "BR", kind: "bank", aliases: ["BB"] },
  { id: "caixa", name: "Caixa Econômica Federal", country: "BR", kind: "bank", aliases: ["Caixa"] },
  { id: "santander-brasil", name: "Santander Brasil", country: "BR", kind: "bank" },
  { id: "banco-inter", name: "Banco Inter", country: "BR", kind: "fintech", aliases: ["Inter"] },
  { id: "c6-bank", name: "C6 Bank", country: "BR", kind: "fintech" },
  { id: "btg-pactual", name: "BTG Pactual", country: "BR", kind: "bank" },
  { id: "xp", name: "XP Investimentos", country: "BR", kind: "broker", aliases: ["XP"] },
  { id: "rico", name: "Rico", country: "BR", kind: "broker" },
  { id: "clear", name: "Clear Corretora", country: "BR", kind: "broker" },
  { id: "modal", name: "Banco Modal", country: "BR", kind: "broker" },
  { id: "safra", name: "Banco Safra", country: "BR", kind: "bank", aliases: ["Safra"] },
  { id: "daycoval", name: "Banco Daycoval", country: "BR", kind: "bank" },
  { id: "bmg", name: "Banco BMG", country: "BR", kind: "bank" },
  { id: "pan", name: "Banco PAN", country: "BR", kind: "bank" },
  { id: "original", name: "Banco Original", country: "BR", kind: "bank" },
  { id: "neon", name: "Neon", country: "BR", kind: "fintech" },
  { id: "next", name: "next", country: "BR", kind: "fintech" },
  { id: "will-bank", name: "Will Bank", country: "BR", kind: "fintech" },
  { id: "pagbank", name: "PagBank", country: "BR", kind: "payments", aliases: ["PagSeguro"] },
  { id: "mercado-pago", name: "Mercado Pago", country: "BR", kind: "payments" },
  { id: "picpay", name: "PicPay", country: "BR", kind: "payments" },
  { id: "infinitepay", name: "InfinitePay", country: "BR", kind: "payments" },
  { id: "stone", name: "Stone", country: "BR", kind: "payments" },
  { id: "sicredi", name: "Sicredi", country: "BR", kind: "credit-union" },
  { id: "sicoob", name: "Sicoob", country: "BR", kind: "credit-union" },
  { id: "cresol", name: "Cresol", country: "BR", kind: "credit-union" },
  { id: "banrisul", name: "Banrisul", country: "BR", kind: "bank" },
  { id: "brb", name: "BRB", country: "BR", kind: "bank" },
  { id: "banestes", name: "Banestes", country: "BR", kind: "bank" },
  { id: "banco-da-amazonia", name: "Banco da Amazônia", country: "BR", kind: "bank" },
  { id: "banco-do-nordeste", name: "Banco do Nordeste", country: "BR", kind: "bank" },
  { id: "revolut", name: "Revolut", country: "GB", kind: "international" },
  { id: "wise", name: "Wise", country: "GB", kind: "international" },
  { id: "hsbc", name: "HSBC", country: "GB", kind: "international" },
  { id: "barclays", name: "Barclays", country: "GB", kind: "international" },
  { id: "lloyds", name: "Lloyds Bank", country: "GB", kind: "international" },
  { id: "monzo", name: "Monzo", country: "GB", kind: "international" },
  { id: "n26", name: "N26", country: "DE", kind: "international" },
  { id: "deutsche-bank", name: "Deutsche Bank", country: "DE", kind: "international" },
  { id: "ubs", name: "UBS", country: "CH", kind: "international" },
  { id: "jpmorgan", name: "JPMorgan Chase", country: "US", kind: "international", aliases: ["Chase"] },
  { id: "bank-of-america", name: "Bank of America", country: "US", kind: "international" },
  { id: "citi", name: "Citi", country: "US", kind: "international", aliases: ["Citibank"] },
  { id: "wells-fargo", name: "Wells Fargo", country: "US", kind: "international" },
  { id: "goldman-sachs", name: "Goldman Sachs", country: "US", kind: "international" },
  { id: "interactive-brokers", name: "Interactive Brokers", country: "US", kind: "broker" },
  { id: "charles-schwab", name: "Charles Schwab", country: "US", kind: "broker" },
  { id: "paypal", name: "PayPal", country: "US", kind: "payments" },
];

export function institutionDisplayName(id: string) {
  return FINANCIAL_INSTITUTIONS.find((institution) => institution.id === id)?.name ?? id;
}
