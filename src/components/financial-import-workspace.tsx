"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { AppLocale } from "@/i18n/locales";
import styles from "./financial-import-workspace.module.css";

type Choice = { id: string; name: string };
type Row = { id: string; occurred_on: string | null; description: string; amount: number | null; currency: string; proposed_type: string | null; review_status: string; official_transaction_id?: string | null };

export function FinancialImportWorkspace({ householdId, locale, selectedImportId, rows, accounts, categories, cards }: { householdId: string; locale: AppLocale; selectedImportId?: string; rows: Row[]; accounts: Choice[]; categories: Choice[]; cards: Choice[] }) {
  const router = useRouter();
  const pt = locale === "pt-BR";
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy("upload"); setMessage("");
    const form = new FormData(event.currentTarget);
    form.set("householdId", householdId);
    const response = await fetch("/api/imports", { method: "POST", body: form });
    const payload = await response.json();
    setBusy(null);
    if (!response.ok) { setMessage(payload.message ?? payload.error ?? "Erro"); return; }
    setMessage(pt ? "Arquivo recebido e preparado para revisão." : "File received and prepared for review.");
    router.refresh();
  }

  async function review(formElement: HTMLFormElement, rowId: string, action: string) {
    if (!selectedImportId) return;
    setBusy(rowId); setMessage("");
    const form = new FormData(formElement);
    const body = { action, occurredOn: form.get("occurredOn"), description: form.get("description"), amount: form.get("amount"), type: form.get("type"), categoryId: form.get("categoryId"), accountId: form.get("accountId"), cardId: form.get("cardId") };
    const response = await fetch(`/api/imports/${selectedImportId}/rows/${rowId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const payload = await response.json();
    setBusy(null);
    if (!response.ok) { setMessage(payload.detail ?? payload.error ?? "Erro"); return; }
    router.refresh();
  }

  return <>
    <form className={styles.upload} onSubmit={upload}>
      <div><strong>{pt ? "Enviar extrato ou fatura" : "Upload statement or bill"}</strong><p>{pt ? "CSV/TXT são interpretados agora; PDF, OFX, XLSX e imagens ficam preservados para os próximos parsers." : "CSV/TXT are parsed now; PDF, OFX, XLSX and images are safely retained for future parsers."}</p></div>
      <input name="file" type="file" required accept=".csv,.txt,.pdf,.ofx,.xlsx,image/jpeg,image/png,image/webp" />
      <select name="currency" defaultValue="BRL"><option>BRL</option><option>USD</option><option>EUR</option><option>GBP</option></select>
      <button disabled={busy === "upload"}>{busy === "upload" ? (pt ? "Enviando..." : "Uploading...") : (pt ? "Enviar arquivo" : "Upload file")}</button>
    </form>
    {message ? <div className={styles.message}>{message}</div> : null}
    <div className={styles.rows}>{rows.map((row) => <form className={styles.row} key={row.id} onSubmit={(event) => { event.preventDefault(); void review(event.currentTarget, row.id, "approve"); }}>
      <div className={styles.rowHeader}><span>{row.currency}</span><strong>{row.review_status === "approved" ? (pt ? "Aprovada" : "Approved") : row.review_status}</strong></div>
      <div className={styles.grid}>
        <label>{pt ? "Data" : "Date"}<input name="occurredOn" type="date" defaultValue={row.occurred_on ?? ""} required /></label>
        <label className={styles.description}>{pt ? "Descrição" : "Description"}<input name="description" defaultValue={row.description} required /></label>
        <label>{pt ? "Valor" : "Amount"}<input name="amount" type="number" step="0.01" defaultValue={row.amount ?? ""} required /></label>
        <label>{pt ? "Tipo" : "Type"}<select name="type" defaultValue={row.proposed_type === "income" ? "income" : "expense"}><option value="expense">{pt ? "Despesa" : "Expense"}</option><option value="income">{pt ? "Receita" : "Income"}</option></select></label>
        <label>{pt ? "Categoria" : "Category"}<select name="categoryId"><option value="">—</option>{categories.map(x => <option value={x.id} key={x.id}>{x.name}</option>)}</select></label>
        <label>{pt ? "Conta" : "Account"}<select name="accountId"><option value="">—</option>{accounts.map(x => <option value={x.id} key={x.id}>{x.name}</option>)}</select></label>
        <label>{pt ? "Cartão" : "Card"}<select name="cardId"><option value="">—</option>{cards.map(x => <option value={x.id} key={x.id}>{x.name}</option>)}</select></label>
      </div>
      <div className={styles.actions}>
        <button type="button" disabled={busy === row.id || row.review_status === "approved"} onClick={(event) => void review(event.currentTarget.form!, row.id, "reject")}>{pt ? "Rejeitar" : "Reject"}</button>
        <button type="submit" disabled={busy === row.id || row.review_status === "approved"}>{row.review_status === "approved" ? (pt ? "Transação criada" : "Transaction created") : busy === row.id ? (pt ? "Aprovando..." : "Approving...") : (pt ? "Aprovar e criar transação" : "Approve and create transaction")}</button>
      </div>
    </form>)}</div>
  </>;
}
