import type { AppLocale } from "@/i18n/locales";

export type CategoryKind = "expense" | "income" | "both";

export function categoryKindLabel(
  kind: string,
  locale: AppLocale,
) {
  const pt = locale === "pt-BR";

  if (kind === "expense") return pt ? "Despesa" : "Expense";
  if (kind === "income") return pt ? "Receita" : "Income";
  if (kind === "both")
    return pt ? "Ambos" : "Both";

  return kind;
}

export function transactionTypeLabel(
  type: string,
  locale: AppLocale,
) {
  const pt = locale === "pt-BR";

  if (type === "expense") return pt ? "Despesa" : "Expense";
  if (type === "income") return pt ? "Receita" : "Income";
  if (type === "transfer")
    return pt ? "Transferência" : "Transfer";

  return type;
}

export const ACCOUNT_TYPE_OPTIONS = [
  ["checking", "Conta corrente", "Checking account"],
  ["savings", "Poupança", "Savings account"],
  ["salary", "Conta salário", "Salary account"],
  ["digital", "Conta digital", "Digital account"],
  ["cash", "Dinheiro", "Cash"],
  ["wallet", "Carteira digital", "Digital wallet"],
  ["food_benefit", "Vale Alimentação", "Food allowance"],
  ["meal_benefit", "Vale Refeição", "Meal allowance"],
  ["transport_benefit", "Vale Transporte", "Transport allowance"],
  ["bonus_benefit", "Cartão Bônus / Benefícios", "Bonus / benefits card"],
  ["prepaid", "Cartão pré-pago", "Prepaid account"],
  ["investment", "Conta de investimentos", "Investment account"],
  ["brokerage", "Corretora", "Brokerage account"],
  ["international", "Conta internacional", "International account"],
  ["crypto", "Carteira de criptoativos", "Crypto wallet"],
  ["other", "Outra", "Other"],
] as const;

export function accountTypeLabel(
  type: string,
  locale: AppLocale,
) {
  const option = ACCOUNT_TYPE_OPTIONS.find(
    ([value]) => value === type,
  );

  if (!option) return type;
  return locale === "pt-BR" ? option[1] : option[2];
}


export function investmentClassLabel(
  assetClass: string,
  locale: AppLocale,
) {
  const pt = locale === "pt-BR";
  const labels: Record<string, [string, string]> = {
    stock: ["Ações", "Stocks"],
    etf: ["ETF", "ETF"],
    fund: ["Fundos", "Funds"],
    fixed_income: ["Renda fixa", "Fixed income"],
    crypto: ["Criptoativos", "Crypto"],
    reit: ["FII / REIT", "REIT"],
    other: ["Outros investimentos", "Other investments"],
  };

  const label = labels[assetClass];
  return label ? (pt ? label[0] : label[1]) : assetClass;
}

type SystemCategory = {
  pt: string;
  en: string;
};

export const SYSTEM_CATEGORY_LABELS: Record<
  string,
  SystemCategory
> = {
  salary: { pt: "Salário", en: "Salary" },
  food_allowance: {
    pt: "Vale Alimentação",
    en: "Food allowance",
  },
  meal_allowance: {
    pt: "Vale Refeição",
    en: "Meal allowance",
  },
  bonus_card: {
    pt: "Cartão Bônus",
    en: "Bonus card",
  },
  profit_sharing: {
    pt: "PLR / PPR",
    en: "Profit sharing",
  },
  transport_allowance: {
    pt: "Vale Transporte",
    en: "Transport allowance",
  },
  thirteenth_salary_first: {
    pt: "13º Salário — 1ª parcela",
    en: "13th salary — first instalment",
  },
  thirteenth_salary_second: {
    pt: "13º Salário — 2ª parcela",
    en: "13th salary — second instalment",
  },
  fourteenth_salary: {
    pt: "14º Salário",
    en: "14th salary",
  },
  vacation_one_third: {
    pt: "Férias — 1/3",
    en: "Vacation pay — 1/3",
  },
  vacation_two_thirds: {
    pt: "Férias — 2/3",
    en: "Vacation pay — 2/3",
  },
  overtime: {
    pt: "Horas extras",
    en: "Overtime",
  },
  commission: {
    pt: "Comissão",
    en: "Commission",
  },
  bonus: {
    pt: "Bônus / Premiação",
    en: "Bonus / Award",
  },
  reimbursement: {
    pt: "Reembolso",
    en: "Reimbursement",
  },
  freelance: {
    pt: "Trabalho extra / Freelance",
    en: "Freelance / Side income",
  },
  investment_income: {
    pt: "Rendimentos de investimentos",
    en: "Investment income",
  },
  dividends: {
    pt: "Dividendos / JCP",
    en: "Dividends",
  },
  rent_income: {
    pt: "Aluguel recebido",
    en: "Rental income",
  },
  other_income: {
    pt: "Outras receitas",
    en: "Other income",
  },

  housing: { pt: "Moradia", en: "Housing" },
  groceries: { pt: "Supermercado", en: "Groceries" },
  dining: { pt: "Restaurantes", en: "Dining" },
  transport: { pt: "Transporte", en: "Transport" },
  fuel: { pt: "Combustível", en: "Fuel" },
  health: { pt: "Saúde", en: "Health" },
  education: { pt: "Educação", en: "Education" },
  leisure: { pt: "Lazer", en: "Leisure" },
  subscriptions: { pt: "Assinaturas", en: "Subscriptions" },
  travel: { pt: "Viagens", en: "Travel" },
  shopping: { pt: "Compras", en: "Shopping" },
  utilities: {
    pt: "Água, luz e serviços",
    en: "Utilities",
  },
  pets: { pt: "Pets", en: "Pets" },
  taxes: { pt: "Impostos e taxas", en: "Taxes and fees" },
  insurance: { pt: "Seguros", en: "Insurance" },
  debt: { pt: "Dívidas e juros", en: "Debt and interest" },
  gifts: { pt: "Presentes e doações", en: "Gifts and donations" },
  personal_care: {
    pt: "Cuidados pessoais",
    en: "Personal care",
  },
  other_expense: {
    pt: "Outras despesas",
    en: "Other expenses",
  },
  adjustment: {
    pt: "Ajustes",
    en: "Adjustments",
  },
};

const LEGACY_NAME_CODES: Record<string, string> = {
  "Salário": "salary",
  "Moradia": "housing",
  "Alimentação": "groceries",
  "Supermercado": "groceries",
  "Transporte": "transport",
  "Saúde": "health",
  "Educação": "education",
  "Lazer": "leisure",
  "Assinaturas": "subscriptions",
  "Viagens": "travel",
  "Compras": "shopping",
  "Rendimentos": "investment_income",
  "Outros": "other_expense",
};

export function categoryDisplayLabel(
  input: {
    name?: string | null;
    systemCode?: string | null;
  },
  locale: AppLocale,
) {
  const systemCode =
    input.systemCode ??
    (input.name ? LEGACY_NAME_CODES[input.name] : undefined);

  if (systemCode && SYSTEM_CATEGORY_LABELS[systemCode]) {
    return locale === "pt-BR"
      ? SYSTEM_CATEGORY_LABELS[systemCode].pt
      : SYSTEM_CATEGORY_LABELS[systemCode].en;
  }

  return input.name ?? (locale === "pt-BR" ? "Sem categoria" : "Uncategorised");
}
