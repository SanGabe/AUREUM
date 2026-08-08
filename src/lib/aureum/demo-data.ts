import type { PaymentBrand } from "@/components/payment-brand";

export const DEMO_MONTH = "2026-08";

export const DEMO_NUCLEUS = {
  id: "demo-nucleus",
  name: "Nossas Finanças",
  type: "couple",
  role: "Proprietário",
  joinCode: "AUR-DEMO2026",
  members: [
    { name: "Gabriel", role: "Proprietário" },
    { name: "Tamires", role: "Administrador" },
  ],
};

export const DEMO_ACCOUNTS = [
  {
    id: "acc-1",
    name: "Conta principal",
    institution: "Banco AUREUM",
    type: "checking",
    currency: "BRL",
    balance: 12840.72,
  },
  {
    id: "acc-2",
    name: "Reserva",
    institution: "Banco AUREUM",
    type: "savings",
    currency: "BRL",
    balance: 5600,
  },
  {
    id: "acc-3",
    name: "Vale Alimentação",
    institution: "Benefícios",
    type: "food_benefit",
    currency: "BRL",
    balance: 1240.5,
  },
  {
    id: "acc-4",
    name: "Conta Europa",
    institution: "Conta internacional",
    type: "international",
    currency: "EUR",
    balance: 450,
  },
];

export const DEMO_CARDS: Array<{
  id: string;
  name: string;
  issuer: string;
  last4: string;
  brand: PaymentBrand;
  currency: string;
  limit: number;
  pending: number;
  closingDay: number;
  dueDay: number;
}> = [
  {
    id: "card-1",
    name: "Cartão principal",
    issuer: "Banco AUREUM",
    last4: "4821",
    brand: "mastercard",
    currency: "BRL",
    limit: 8500,
    pending: 1347.8,
    closingDay: 8,
    dueDay: 15,
  },
  {
    id: "card-2",
    name: "Cartão viagens",
    issuer: "Banco Internacional",
    last4: "7714",
    brand: "visa",
    currency: "EUR",
    limit: 2500,
    pending: 186.2,
    closingDay: 20,
    dueDay: 28,
  },
  {
    id: "card-3",
    name: "Cartão benefícios",
    issuer: "Benefícios",
    last4: "1309",
    brand: "american-express",
    currency: "BRL",
    limit: 1800,
    pending: 272,
    closingDay: 25,
    dueDay: 5,
  },
];

export const DEMO_GOALS = [
  {
    id: "goal-1",
    title: "Mudança para Portugal",
    current: 20418.73,
    target: 35000,
    currency: "BRL",
    targetDate: "2027-02-01",
    status: "active",
  },
  {
    id: "goal-2",
    title: "Reserva de emergência",
    current: 5600,
    target: 12000,
    currency: "BRL",
    targetDate: "2027-06-01",
    status: "active",
  },
  {
    id: "goal-3",
    title: "Notebook novo",
    current: 2800,
    target: 7000,
    currency: "BRL",
    targetDate: "2027-03-15",
    status: "active",
  },
];

export const DEMO_INVESTMENTS = [
  {
    id: "inv-1",
    name: "Tesouro Selic",
    symbol: "SELIC",
    assetClass: "fixed_income",
    quantity: 1,
    averagePrice: 4081.27,
    currentPrice: 4260.12,
    currency: "BRL",
    institution: "Corretora AUREUM",
  },
  {
    id: "inv-2",
    name: "Petrobras PN",
    symbol: "PETR4",
    assetClass: "stock",
    quantity: 100,
    averagePrice: 31.4,
    currentPrice: 34.12,
    currency: "BRL",
    institution: "Corretora AUREUM",
  },
  {
    id: "inv-3",
    name: "ETF Global",
    symbol: "WRLD11",
    assetClass: "etf",
    quantity: 18,
    averagePrice: 110,
    currentPrice: 116.7,
    currency: "BRL",
    institution: "Corretora AUREUM",
  },
];

export const DEMO_CATEGORIES = [
  { id: "cat-1", name: "Salário", systemCode: "salary", kind: "income", total: 2702 },
  { id: "cat-2", name: "Vale Alimentação", systemCode: "food_allowance", kind: "income", total: 1000 },
  { id: "cat-3", name: "Vale Refeição", systemCode: "meal_allowance", kind: "income", total: 600 },
  { id: "cat-4", name: "Bônus / Premiação", systemCode: "bonus", kind: "income", total: 400 },
  { id: "cat-5", name: "Moradia", systemCode: "housing", kind: "expense", total: 1480 },
  { id: "cat-6", name: "Supermercado", systemCode: "groceries", kind: "expense", total: 696 },
  { id: "cat-7", name: "Transporte", systemCode: "transport", kind: "expense", total: 240 },
  { id: "cat-8", name: "Lazer", systemCode: "leisure", kind: "expense", total: 180.44 },
  { id: "cat-9", name: "Ajustes", systemCode: "adjustment", kind: "both", total: 0 },
];

export const DEMO_TRANSACTIONS = [
  {
    id: "tx-1",
    description: "Salário",
    type: "income",
    amount: 2702,
    currency: "BRL",
    date: "2026-08-01",
    category: "Salário",
    account: "Conta principal",
    card: null,
  },
  {
    id: "tx-2",
    description: "Vale Alimentação",
    type: "income",
    amount: 1000,
    currency: "BRL",
    date: "2026-08-01",
    category: "Vale Alimentação",
    account: "Vale Alimentação",
    card: null,
  },
  {
    id: "tx-3",
    description: "Aluguel",
    type: "expense",
    amount: 1480,
    currency: "BRL",
    date: "2026-08-03",
    category: "Moradia",
    account: "Conta principal",
    card: null,
  },
  {
    id: "tx-4",
    description: "Supermercado",
    type: "expense",
    amount: 386.42,
    currency: "BRL",
    date: "2026-08-05",
    category: "Supermercado",
    account: null,
    card: "Cartão principal •••• 4821",
  },
  {
    id: "tx-5",
    description: "Restaurante",
    type: "expense",
    amount: 148.9,
    currency: "BRL",
    date: "2026-08-06",
    category: "Lazer",
    account: null,
    card: "Cartão benefícios •••• 1309",
  },
  {
    id: "tx-6",
    description: "Transferência para reserva",
    type: "transfer",
    amount: 600,
    currency: "BRL",
    date: "2026-08-07",
    category: null,
    account: "Conta principal → Reserva",
    card: null,
  },
];

export const DEMO_RATES = [
  { code: "USD", ratePerBrl: 0.1845 },
  { code: "EUR", ratePerBrl: 0.1582 },
  { code: "GBP", ratePerBrl: 0.1364 },
  { code: "ARS", ratePerBrl: 241.7 },
  { code: "CNY", ratePerBrl: 1.326 },
  { code: "JPY", ratePerBrl: 27.14 },
  { code: "CHF", ratePerBrl: 0.1489 },
  { code: "CAD", ratePerBrl: 0.2531 },
];

export const DEMO_APPROVALS = [
  {
    id: "app-1",
    type: "join",
    person: "Anthony",
    description: "Solicitou entrada no Núcleo como Membro.",
    status: "pending",
  },
  {
    id: "app-2",
    type: "transaction",
    person: "Tamires",
    description: "Despesa • Farmácia • R$ 86,30",
    status: "pending",
  },
];

export const DEMO_ANALYTICS = {
  currency: "BRL",
  trackedAssets: 32800,
  cashValue: 20418.73,
  investmentValue: 12381.27,
  income: 4702,
  expenses: 2596.44,
  savings: 2105.56,
  savingsRate: 44.78,
  monthly: [
    { month: "2026-01", income: 4100, expenses: 2900, cashFlow: 1200, liquidBalance: 9800 },
    { month: "2026-02", income: 4300, expenses: 3100, cashFlow: 1200, liquidBalance: 11000 },
    { month: "2026-03", income: 4200, expenses: 2700, cashFlow: 1500, liquidBalance: 12500 },
    { month: "2026-04", income: 5900, expenses: 3300, cashFlow: 2600, liquidBalance: 15100 },
    { month: "2026-05", income: 4400, expenses: 2850, cashFlow: 1550, liquidBalance: 16650 },
    { month: "2026-06", income: 4500, expenses: 3100, cashFlow: 1400, liquidBalance: 18050 },
    { month: "2026-07", income: 4600, expenses: 3250, cashFlow: 1350, liquidBalance: 19400 },
    { month: "2026-08", income: 4702, expenses: 2596.44, cashFlow: 2105.56, liquidBalance: 20418.73 },
  ],
  expenseCategories: [
    { name: "Moradia", systemCode: "housing", total: 1480, percentage: 57 },
    { name: "Supermercado", systemCode: "groceries", total: 696, percentage: 27 },
    { name: "Transporte", systemCode: "transport", total: 240, percentage: 9 },
    { name: "Lazer", systemCode: "leisure", total: 180.44, percentage: 7 },
  ],
  incomeCategories: [
    { name: "Salário", systemCode: "salary", total: 2702, percentage: 57 },
    { name: "Vale Alimentação", systemCode: "food_allowance", total: 1000, percentage: 21 },
    { name: "Vale Refeição", systemCode: "meal_allowance", total: 600, percentage: 13 },
    { name: "Bônus / Premiação", systemCode: "bonus", total: 400, percentage: 9 },
  ],
  accountTypes: [
    { key: "checking", value: 12840.72 },
    { key: "savings", value: 5600 },
    { key: "food_benefit", value: 1240.5 },
    { key: "international", value: 737.51 },
  ],
  investmentTypes: [
    { key: "fixed_income", value: 4260.12 },
    { key: "stock", value: 3412 },
    { key: "etf", value: 2100.6 },
  ],
};
