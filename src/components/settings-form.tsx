"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CurrencySelect } from "@/components/currency-select";
import { ThemeButtons } from "@/components/theme-selector";
import type { AppLocale, EnglishLocale } from "@/i18n/locales";
import { getEnglishCopy } from "@/i18n/english-copy";
import styles from "./account-page.module.css";

export function SettingsForm({
  initialCurrency,
  initialLocale,
  userId,
  locale = "pt-BR",
}: {
  initialCurrency: string;
  initialLocale: string;
  userId: string;
  locale?: AppLocale;
}) {
  const en =
    locale === "pt-BR"
      ? null
      : getEnglishCopy(locale as EnglishLocale);

  const [currency, setCurrency] = useState(initialCurrency || "BRL");
  const [preferredLocale, setPreferredLocale] = useState(
    initialLocale || locale,
  );
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
          locale: preferredLocale,
        })
        .eq("id", userId);

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setMessage(
        en?.account.preferencesSaved ?? "Preferências atualizadas.",
      );
    } catch {
      setError(
        en?.account.genericError ??
          "Não foi possível salvar as configurações.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={save}>
      <label>
        {en?.account.locale ?? "Idioma e região"}
        <select
          onChange={(event) => setPreferredLocale(event.target.value)}
          value={preferredLocale}
        >
          <option value="pt-BR">Português — Brasil</option>
          <option value="en-US">English — United States</option>
          <option value="en-GB">English — United Kingdom</option>
        </select>
      </label>

      <div className={styles.themeSetting}>
        <span>{locale === "pt-BR" ? "Aparência" : "Appearance"}</span>
        <ThemeButtons locale={locale} />
      </div>

      <label>
        {en?.account.personalCurrency ?? "Moeda padrão pessoal"}
        <CurrencySelect
          disabled={loading}
          locale={locale}
          onChange={setCurrency}
          value={currency}
        />
        <small>
          {en?.account.nucleusCurrencyHelp ??
            "Cada Núcleo continua podendo ter sua própria moeda principal."}
        </small>
      </label>

      {error ? <div className={styles.error}>{error}</div> : null}
      {message ? <div className={styles.success}>{message}</div> : null}

      <button disabled={loading} type="submit">
        {loading
          ? en?.account.saving ?? "Salvando..."
          : en?.account.savePreferences ?? "Salvar preferências"}
      </button>
    </form>
  );
}
