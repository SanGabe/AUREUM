"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CurrencySelect } from "@/components/currency-select";
import type { AppLocale } from "@/i18n/locales";
import type { MembershipRole } from "@/lib/aureum/finance-context";
import styles from "./finance-page.module.css";

type Choice = { id: string; name: string };

function text(locale: AppLocale) {
  const en = locale !== "pt-BR";
  return {
    save: en ? "Save" : "Salvar",
    saving: en ? "Saving..." : "Salvando...",
    sent: en ? "Sent for approval." : "Enviado para aprovação.",
    saved: en ? "Saved successfully." : "Salvo com sucesso.",
    denied: en
      ? "Your role cannot create official financial records."
      : "Seu perfil não pode criar registros financeiros oficiais.",
    error: en
      ? "We could not complete this operation."
      : "Não foi possível concluir esta operação.",
  };
}

function useResult(locale: AppLocale) {
  const t = text(locale);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  return {
    t,
    router,
    loading,
    message,
    error,
    begin() {
      setLoading(true);
      setMessage("");
      setError("");
    },
    ok(message = t.saved) {
      setMessage(message);
      setLoading(false);
      router.refresh();
    },
    fail(message = t.error) {
      setError(message);
      setLoading(false);
    },
  };
}

export function TransactionForm({
  accounts,
  cards,
  categories,
  currency,
  householdId,
  locale,
  role,
  userId,
}: {
  accounts: Choice[];
  cards: Choice[];
  categories: Choice[];
  currency: string;
  householdId: string;
  locale: AppLocale;
  role: MembershipRole;
  userId: string;
}) {
  const state = useResult(locale);
  const [type, setType] = useState<"income" | "expense" | "transfer">("expense");
  const [selectedCurrency, setSelectedCurrency] = useState(currency);

  const canSubmit = role !== "viewer";
  const contributor = role === "financial_contributor";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      state.fail(state.t.denied);
      return;
    }

    state.begin();

    const form = new FormData(event.currentTarget);
    const amount = Number(form.get("amount"));

    const data = {
      description: String(form.get("description") ?? "").trim(),
      type,
      amount,
      currency: selectedCurrency,
      occurred_at: new Date(String(form.get("occurred_at"))).toISOString(),
      category_id: String(form.get("category_id") || "") || null,
      account_id: String(form.get("account_id") || "") || null,
      transfer_account_id:
        type === "transfer"
          ? String(form.get("transfer_account_id") || "") || null
          : null,
      card_id:
        type === "expense"
          ? String(form.get("card_id") || "") || null
          : null,
      reimbursable: form.get("reimbursable") === "on",
      origin: "WEB",
      status: "posted",
    };

    if (!data.description || !Number.isFinite(amount) || amount <= 0) {
      state.fail(
        locale === "pt-BR"
          ? "Informe descrição e valor válidos."
          : "Enter a valid description and amount.",
      );
      return;
    }

    const supabase = createClient();

    if (contributor) {
      const { error } = await supabase.from("financial_submissions").insert({
        household_id: householdId,
        requester_id: userId,
        payload: {
          entity: "transaction",
          data,
        },
      });

      if (error) {
        state.fail(error.message);
        return;
      }

      state.ok(state.t.sent);
      event.currentTarget.reset();
      setSelectedCurrency(currency);
      setType("expense");
      return;
    }

    const { error } = await supabase.from("transactions").insert({
      household_id: householdId,
      created_by: userId,
      ...data,
    });

    if (error) {
      state.fail(error.message);
      return;
    }

    state.ok();
    event.currentTarget.reset();
    setSelectedCurrency(currency);
    setType("expense");
  }

  return (
    <div className={styles.formCard}>
      <h2>
        {locale === "pt-BR" ? "Novo lançamento" : "New transaction"}
      </h2>

      {!canSubmit ? (
        <div className={styles.notice} style={{ marginTop: 14 }}>
          {state.t.denied}
        </div>
      ) : contributor ? (
        <div className={styles.notice} style={{ marginTop: 14 }}>
          {locale === "pt-BR"
            ? "Como Colaborador Financeiro, seu lançamento será enviado para aprovação."
            : "As a Financial Contributor, your entry will be sent for approval."}
        </div>
      ) : null}

      <form onSubmit={submit}>
        <div className={styles.formGrid}>
          <label className={styles.field}>
            {locale === "pt-BR" ? "Descrição" : "Description"}
            <input name="description" required />
          </label>

          <label className={styles.field}>
            {locale === "pt-BR" ? "Tipo" : "Type"}
            <select
              onChange={(event) =>
                setType(
                  event.target.value as
                    | "income"
                    | "expense"
                    | "transfer",
                )
              }
              value={type}
            >
              <option value="expense">
                {locale === "pt-BR" ? "Despesa" : "Expense"}
              </option>
              <option value="income">
                {locale === "pt-BR" ? "Receita" : "Income"}
              </option>
              <option value="transfer">
                {locale === "pt-BR" ? "Transferência" : "Transfer"}
              </option>
            </select>
          </label>

          <label className={styles.field}>
            {locale === "pt-BR" ? "Valor" : "Amount"}
            <input
              min="0.01"
              name="amount"
              required
              step="0.01"
              type="number"
            />
          </label>

          <label className={styles.field}>
            {locale === "pt-BR" ? "Moeda" : "Currency"}
            <CurrencySelect
              locale={locale}
              onChange={setSelectedCurrency}
              value={selectedCurrency}
            />
          </label>

          <label className={styles.field}>
            {locale === "pt-BR" ? "Data" : "Date"}
            <input
              defaultValue={new Date().toISOString().slice(0, 10)}
              name="occurred_at"
              required
              type="date"
            />
          </label>

          <label className={styles.field}>
            {locale === "pt-BR" ? "Categoria" : "Category"}
            <select name="category_id">
              <option value="">
                {locale === "pt-BR" ? "Sem categoria" : "Uncategorised"}
              </option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            {locale === "pt-BR" ? "Conta de origem" : "Source account"}
            <select name="account_id">
              <option value="">
                {locale === "pt-BR" ? "Nenhuma" : "None"}
              </option>
              {accounts.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          {type === "transfer" ? (
            <label className={styles.field}>
              {locale === "pt-BR" ? "Conta de destino" : "Destination account"}
              <select name="transfer_account_id" required>
                <option value="">
                  {locale === "pt-BR" ? "Selecione" : "Select"}
                </option>
                {accounts.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          {type === "expense" ? (
            <label className={styles.field}>
              {locale === "pt-BR" ? "Cartão" : "Card"}
              <select name="card_id">
                <option value="">
                  {locale === "pt-BR" ? "Nenhum" : "None"}
                </option>
                {cards.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </div>

        {type === "expense" ? (
          <label className={styles.field} style={{ display: "flex", gridTemplateColumns: "auto 1fr", alignItems: "center" }}>
            <input
              name="reimbursable"
              style={{ width: 16, minHeight: 16 }}
              type="checkbox"
            />
            {locale === "pt-BR" ? "Reembolsável" : "Reimbursable"}
          </label>
        ) : null}

        {state.error ? <div className={styles.error}>{state.error}</div> : null}
        {state.message ? <div className={styles.success}>{state.message}</div> : null}

        <button
          className={styles.primaryButton}
          disabled={state.loading || !canSubmit}
          type="submit"
        >
          {state.loading
            ? state.t.saving
            : contributor
              ? locale === "pt-BR"
                ? "Enviar para aprovação"
                : "Send for approval"
              : state.t.save}
        </button>
      </form>
    </div>
  );
}

export function CategoryForm({
  householdId,
  locale,
  role,
}: {
  householdId: string;
  locale: AppLocale;
  role: MembershipRole;
}) {
  const state = useResult(locale);
  const manager = role === "owner" || role === "admin";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!manager) return state.fail(state.t.denied);

    state.begin();
    const form = new FormData(event.currentTarget);
    const supabase = createClient();

    const { error } = await supabase.from("categories").insert({
      household_id: householdId,
      name: String(form.get("name") ?? "").trim(),
      kind: String(form.get("kind") ?? "expense"),
      icon: String(form.get("icon") ?? "").trim() || null,
    });

    if (error) return state.fail(error.message);
    state.ok();
    event.currentTarget.reset();
  }

  return (
    <div className={styles.formCard}>
      <h2>{locale === "pt-BR" ? "Nova categoria" : "New category"}</h2>
      <form onSubmit={submit}>
        <div className={styles.formGrid}>
          <label className={styles.field}>
            {locale === "pt-BR" ? "Nome" : "Name"}
            <input name="name" required />
          </label>
          <label className={styles.field}>
            {locale === "pt-BR" ? "Tipo" : "Type"}
            <select name="kind">
              <option value="expense">{locale === "pt-BR" ? "Despesa" : "Expense"}</option>
              <option value="income">{locale === "pt-BR" ? "Receita" : "Income"}</option>
              <option value="both">{locale === "pt-BR" ? "Ambos" : "Both"}</option>
            </select>
          </label>
        </div>
        {state.error ? <div className={styles.error}>{state.error}</div> : null}
        {state.message ? <div className={styles.success}>{state.message}</div> : null}
        <button className={styles.primaryButton} disabled={!manager || state.loading}>
          {state.loading ? state.t.saving : state.t.save}
        </button>
      </form>
    </div>
  );
}

export function GoalForm({
  currency,
  householdId,
  locale,
  role,
  userId,
}: {
  currency: string;
  householdId: string;
  locale: AppLocale;
  role: MembershipRole;
  userId: string;
}) {
  const state = useResult(locale);
  const manager = role === "owner" || role === "admin";
  const [selectedCurrency, setSelectedCurrency] = useState(currency);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!manager) return state.fail(state.t.denied);

    state.begin();
    const form = new FormData(event.currentTarget);
    const supabase = createClient();

    const { error } = await supabase.from("goals").insert({
      household_id: householdId,
      title: String(form.get("title") ?? "").trim(),
      target_amount: Number(form.get("target_amount")),
      current_amount: Number(form.get("current_amount") || 0),
      currency: selectedCurrency,
      target_date: String(form.get("target_date") || "") || null,
      status: "active",
      created_by: userId,
    });

    if (error) return state.fail(error.message);
    state.ok();
    event.currentTarget.reset();
    setSelectedCurrency(currency);
  }

  return (
    <div className={styles.formCard}>
      <h2>{locale === "pt-BR" ? "Nova meta" : "New goal"}</h2>
      <form onSubmit={submit}>
        <div className={styles.formGrid}>
          <label className={styles.field}>
            {locale === "pt-BR" ? "Título" : "Title"}
            <input name="title" required />
          </label>
          <label className={styles.field}>
            {locale === "pt-BR" ? "Valor alvo" : "Target amount"}
            <input min="0.01" name="target_amount" required step="0.01" type="number" />
          </label>
          <label className={styles.field}>
            {locale === "pt-BR" ? "Valor atual" : "Current amount"}
            <input min="0" name="current_amount" step="0.01" type="number" />
          </label>
          <label className={styles.field}>
            {locale === "pt-BR" ? "Moeda" : "Currency"}
            <CurrencySelect locale={locale} onChange={setSelectedCurrency} value={selectedCurrency} />
          </label>
          <label className={styles.field}>
            {locale === "pt-BR" ? "Data alvo" : "Target date"}
            <input name="target_date" type="date" />
          </label>
        </div>
        {state.error ? <div className={styles.error}>{state.error}</div> : null}
        {state.message ? <div className={styles.success}>{state.message}</div> : null}
        <button className={styles.primaryButton} disabled={!manager || state.loading}>
          {state.loading ? state.t.saving : state.t.save}
        </button>
      </form>
    </div>
  );
}

export function AccountForm({
  currency,
  householdId,
  locale,
  role,
  userId,
}: {
  currency: string;
  householdId: string;
  locale: AppLocale;
  role: MembershipRole;
  userId: string;
}) {
  const state = useResult(locale);
  const manager = role === "owner" || role === "admin";
  const [selectedCurrency, setSelectedCurrency] = useState(currency);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!manager) return state.fail(state.t.denied);

    state.begin();
    const form = new FormData(event.currentTarget);
    const supabase = createClient();

    const { error } = await supabase.from("accounts").insert({
      household_id: householdId,
      name: String(form.get("name") ?? "").trim(),
      type: String(form.get("type") ?? "checking"),
      currency: selectedCurrency,
      opening_balance: Number(form.get("opening_balance") || 0),
      institution: String(form.get("institution") ?? "").trim() || null,
      created_by: userId,
    });

    if (error) return state.fail(error.message);
    state.ok();
    event.currentTarget.reset();
    setSelectedCurrency(currency);
  }

  return (
    <div className={styles.formCard}>
      <h2>{locale === "pt-BR" ? "Nova conta" : "New account"}</h2>
      <form onSubmit={submit}>
        <div className={styles.formGrid}>
          <label className={styles.field}>
            {locale === "pt-BR" ? "Nome da conta" : "Account name"}
            <input name="name" required />
          </label>
          <label className={styles.field}>
            {locale === "pt-BR" ? "Banco / instituição" : "Bank / institution"}
            <input name="institution" />
          </label>
          <label className={styles.field}>
            {locale === "pt-BR" ? "Tipo" : "Type"}
            <select name="type">
              <option value="checking">{locale === "pt-BR" ? "Conta corrente" : "Checking"}</option>
              <option value="savings">{locale === "pt-BR" ? "Poupança" : "Savings"}</option>
              <option value="cash">{locale === "pt-BR" ? "Dinheiro" : "Cash"}</option>
              <option value="wallet">{locale === "pt-BR" ? "Carteira digital" : "Wallet"}</option>
              <option value="investment">{locale === "pt-BR" ? "Conta de investimentos" : "Investment account"}</option>
              <option value="other">{locale === "pt-BR" ? "Outra" : "Other"}</option>
            </select>
          </label>
          <label className={styles.field}>
            {locale === "pt-BR" ? "Saldo inicial" : "Opening balance"}
            <input name="opening_balance" step="0.01" type="number" />
          </label>
          <label className={styles.field}>
            {locale === "pt-BR" ? "Moeda" : "Currency"}
            <CurrencySelect locale={locale} onChange={setSelectedCurrency} value={selectedCurrency} />
          </label>
        </div>
        {state.error ? <div className={styles.error}>{state.error}</div> : null}
        {state.message ? <div className={styles.success}>{state.message}</div> : null}
        <button className={styles.primaryButton} disabled={!manager || state.loading}>
          {state.loading ? state.t.saving : state.t.save}
        </button>
      </form>
    </div>
  );
}

export function CardForm({
  currency,
  householdId,
  locale,
  role,
  userId,
}: {
  currency: string;
  householdId: string;
  locale: AppLocale;
  role: MembershipRole;
  userId: string;
}) {
  const state = useResult(locale);
  const manager = role === "owner" || role === "admin";
  const [selectedCurrency, setSelectedCurrency] = useState(currency);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!manager) return state.fail(state.t.denied);

    state.begin();
    const form = new FormData(event.currentTarget);
    const supabase = createClient();

    const { error } = await supabase.from("cards").insert({
      household_id: householdId,
      name: String(form.get("name") ?? "").trim(),
      issuer: String(form.get("issuer") ?? "").trim() || null,
      last4: String(form.get("last4") ?? "").trim() || null,
      currency: selectedCurrency,
      limit_amount: Number(form.get("limit_amount") || 0) || null,
      closing_day: Number(form.get("closing_day") || 0) || null,
      due_day: Number(form.get("due_day") || 0) || null,
      created_by: userId,
    });

    if (error) return state.fail(error.message);
    state.ok();
    event.currentTarget.reset();
    setSelectedCurrency(currency);
  }

  return (
    <div className={styles.formCard}>
      <h2>{locale === "pt-BR" ? "Novo cartão" : "New card"}</h2>
      <form onSubmit={submit}>
        <div className={styles.formGrid}>
          <label className={styles.field}>
            {locale === "pt-BR" ? "Nome" : "Name"}
            <input name="name" required />
          </label>
          <label className={styles.field}>
            {locale === "pt-BR" ? "Emissor" : "Issuer"}
            <input name="issuer" />
          </label>
          <label className={styles.field}>
            {locale === "pt-BR" ? "Últimos 4 dígitos" : "Last 4 digits"}
            <input maxLength={4} name="last4" pattern="[0-9]{4}" />
          </label>
          <label className={styles.field}>
            {locale === "pt-BR" ? "Limite" : "Limit"}
            <input min="0" name="limit_amount" step="0.01" type="number" />
          </label>
          <label className={styles.field}>
            {locale === "pt-BR" ? "Fechamento" : "Closing day"}
            <input max="31" min="1" name="closing_day" type="number" />
          </label>
          <label className={styles.field}>
            {locale === "pt-BR" ? "Vencimento" : "Due day"}
            <input max="31" min="1" name="due_day" type="number" />
          </label>
          <label className={styles.field}>
            {locale === "pt-BR" ? "Moeda" : "Currency"}
            <CurrencySelect locale={locale} onChange={setSelectedCurrency} value={selectedCurrency} />
          </label>
        </div>
        {state.error ? <div className={styles.error}>{state.error}</div> : null}
        {state.message ? <div className={styles.success}>{state.message}</div> : null}
        <button className={styles.primaryButton} disabled={!manager || state.loading}>
          {state.loading ? state.t.saving : state.t.save}
        </button>
      </form>
    </div>
  );
}

export function InvestmentForm({
  accounts,
  currency,
  householdId,
  locale,
  role,
  userId,
}: {
  accounts: Choice[];
  currency: string;
  householdId: string;
  locale: AppLocale;
  role: MembershipRole;
  userId: string;
}) {
  const state = useResult(locale);
  const manager = role === "owner" || role === "admin";
  const [selectedCurrency, setSelectedCurrency] = useState(currency);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!manager) return state.fail(state.t.denied);

    state.begin();
    const form = new FormData(event.currentTarget);
    const supabase = createClient();

    const { error } = await supabase.from("investments").insert({
      household_id: householdId,
      account_id: String(form.get("account_id") || "") || null,
      name: String(form.get("name") ?? "").trim(),
      symbol: String(form.get("symbol") ?? "").trim().toUpperCase() || null,
      asset_class: String(form.get("asset_class") ?? "other"),
      quantity: Number(form.get("quantity") || 0),
      average_price: Number(form.get("average_price") || 0),
      current_price: Number(form.get("current_price") || 0) || null,
      currency: selectedCurrency,
      institution: String(form.get("institution") ?? "").trim() || null,
      created_by: userId,
    });

    if (error) return state.fail(error.message);
    state.ok();
    event.currentTarget.reset();
    setSelectedCurrency(currency);
  }

  return (
    <div className={styles.formCard}>
      <h2>{locale === "pt-BR" ? "Novo investimento" : "New investment"}</h2>
      <form onSubmit={submit}>
        <div className={styles.formGrid}>
          <label className={styles.field}>
            {locale === "pt-BR" ? "Ativo" : "Asset"}
            <input name="name" required />
          </label>
          <label className={styles.field}>
            {locale === "pt-BR" ? "Ticker / símbolo" : "Ticker / symbol"}
            <input name="symbol" />
          </label>
          <label className={styles.field}>
            {locale === "pt-BR" ? "Classe" : "Asset class"}
            <select name="asset_class">
              <option value="stock">{locale === "pt-BR" ? "Ação" : "Stock"}</option>
              <option value="etf">ETF</option>
              <option value="fund">{locale === "pt-BR" ? "Fundo" : "Fund"}</option>
              <option value="fixed_income">{locale === "pt-BR" ? "Renda fixa" : "Fixed income"}</option>
              <option value="crypto">Crypto</option>
              <option value="reit">{locale === "pt-BR" ? "FII / REIT" : "REIT"}</option>
              <option value="other">{locale === "pt-BR" ? "Outro" : "Other"}</option>
            </select>
          </label>
          <label className={styles.field}>
            {locale === "pt-BR" ? "Quantidade" : "Quantity"}
            <input min="0" name="quantity" required step="0.00000001" type="number" />
          </label>
          <label className={styles.field}>
            {locale === "pt-BR" ? "Preço médio" : "Average price"}
            <input min="0" name="average_price" required step="0.00000001" type="number" />
          </label>
          <label className={styles.field}>
            {locale === "pt-BR" ? "Preço atual" : "Current price"}
            <input min="0" name="current_price" step="0.00000001" type="number" />
          </label>
          <label className={styles.field}>
            {locale === "pt-BR" ? "Conta vinculada" : "Linked account"}
            <select name="account_id">
              <option value="">{locale === "pt-BR" ? "Nenhuma" : "None"}</option>
              {accounts.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
          <label className={styles.field}>
            {locale === "pt-BR" ? "Instituição" : "Institution"}
            <input name="institution" />
          </label>
          <label className={styles.field}>
            {locale === "pt-BR" ? "Moeda" : "Currency"}
            <CurrencySelect locale={locale} onChange={setSelectedCurrency} value={selectedCurrency} />
          </label>
        </div>
        {state.error ? <div className={styles.error}>{state.error}</div> : null}
        {state.message ? <div className={styles.success}>{state.message}</div> : null}
        <button className={styles.primaryButton} disabled={!manager || state.loading}>
          {state.loading ? state.t.saving : state.t.save}
        </button>
      </form>
    </div>
  );
}
