"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import styles from "./account-page.module.css";

export function SettingsForm({
  initialCurrency,
  initialLocale,
  userId,
}: {
  initialCurrency: string;
  initialLocale: string;
  userId: string;
}) {
  const [currency, setCurrency] = useState(initialCurrency || "BRL");
  const [locale, setLocale] = useState(initialLocale || "pt-BR");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function save(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const supabase = createClient();

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          default_currency: currency,
          locale,
        })
        .eq("id", userId);

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setMessage("Preferências atualizadas.");
    } catch {
      setError("Não foi possível salvar as configurações.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={save}>
      <label>
        Idioma e região
        <select onChange={(event) => setLocale(event.target.value)} value={locale}>
          <option value="pt-BR">Português — Brasil</option>
          <option value="pt-PT">Português — Portugal</option>
        </select>
      </label>

      <label>
        Moeda padrão pessoal
        <select
          onChange={(event) => setCurrency(event.target.value)}
          value={currency}
        >
          <option value="BRL">Real brasileiro — BRL</option>
          <option value="EUR">Euro — EUR</option>
        </select>
        <small>
          Cada Núcleo continua podendo ter sua própria moeda principal.
        </small>
      </label>

      {error ? <div className={styles.error}>{error}</div> : null}
      {message ? <div className={styles.success}>{message}</div> : null}

      <button disabled={loading} type="submit">
        {loading ? "Salvando..." : "Salvar preferências"}
      </button>
    </form>
  );
}
