"use client";

import { FormEvent, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import styles from "./onboarding-form.module.css";

type OnboardingFormProps = {
  userId: string;
};

type HouseholdType = "personal" | "couple" | "family";

export function OnboardingForm({ userId }: OnboardingFormProps) {
  const submittingRef = useRef(false);

  const [name, setName] = useState("");
  const [type, setType] = useState<HouseholdType>("personal");
  const [currency, setCurrency] = useState<"BRL" | "EUR">("BRL");
  const [country, setCountry] = useState<"BR" | "PT">("BR");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleCurrencyChange(value: "BRL" | "EUR") {
    setCurrency(value);
    setCountry(value === "EUR" ? "PT" : "BR");
  }

  async function userAlreadyHasAccess() {
    const supabase = createClient();

    const { data, error: membershipError } = await supabase
      .from("household_members")
      .select("household_id")
      .eq("user_id", userId)
      .limit(1)
      .maybeSingle();

    if (membershipError) {
      throw membershipError;
    }

    return Boolean(data);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Protect the first Household from duplicate submissions.
    if (submittingRef.current) {
      return;
    }

    submittingRef.current = true;
    setLoading(true);
    setError("");

    try {
      // Onboarding is ONLY for establishing the first Household.
      // Households 2+ are managed after entering the app.
      if (await userAlreadyHasAccess()) {
        window.location.replace("/dashboard");
        return;
      }

      const trimmedName = name.trim();

      if (!trimmedName) {
        setError("Escolha um nome para seu espaço financeiro.");
        return;
      }

      const supabase = createClient();

      const { data: household, error: insertError } = await supabase
        .from("households")
        .insert({
          name: trimmedName,
          type,
          default_currency: currency,
          country_code: country,
          created_by: userId,
        })
        .select("id")
        .single();

      if (insertError) {
        if (insertError.message?.includes("HOUSEHOLD_OWNER_LIMIT_REACHED")) {
          setError("Você já é proprietário de 3 Households.");
          return;
        }

        if (insertError.message?.includes("HOUSEHOLD_ACCESS_LIMIT_REACHED")) {
          setError("Você já tem acesso ao limite de 10 Households.");
          return;
        }

        setError(`Não foi possível criar o espaço: ${insertError.message}`);
        return;
      }

      if (!household) {
        setError("A Household não pôde ser confirmada.");
        return;
      }

      const { data: membership, error: membershipError } = await supabase
        .from("household_members")
        .select("household_id, role")
        .eq("household_id", household.id)
        .eq("user_id", userId)
        .maybeSingle();

      if (membershipError || !membership) {
        setError(
          "A Household foi criada, mas o vínculo de proprietário ainda não pôde ser confirmado.",
        );
        return;
      }

      window.location.replace("/dashboard");
    } catch {
      setError("Não foi possível concluir a configuração. Tente novamente.");
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        Nome do espaço
        <input
          autoFocus
          disabled={loading}
          maxLength={80}
          onChange={(event) => setName(event.target.value)}
          placeholder="Ex.: Minhas finanças, Nossa casa..."
          required
          type="text"
          value={name}
        />
      </label>

      <fieldset className={styles.fieldset} disabled={loading}>
        <legend>Como você vai usar o AUREUM?</legend>

        <div className={styles.options}>
          <label className={styles.option}>
            <input
              checked={type === "personal"}
              name="household-type"
              onChange={() => setType("personal")}
              type="radio"
            />
            <span>
              <strong>Pessoal</strong>
              <small>Para organizar suas próprias finanças.</small>
            </span>
          </label>

          <label className={styles.option}>
            <input
              checked={type === "couple"}
              name="household-type"
              onChange={() => setType("couple")}
              type="radio"
            />
            <span>
              <strong>Casal</strong>
              <small>Um espaço financeiro compartilhado por duas pessoas.</small>
            </span>
          </label>

          <label className={styles.option}>
            <input
              checked={type === "family"}
              name="household-type"
              onChange={() => setType("family")}
              type="radio"
            />
            <span>
              <strong>Família</strong>
              <small>Para organizar finanças de vários membros.</small>
            </span>
          </label>
        </div>
      </fieldset>

      <label className={styles.field}>
        Moeda principal
        <select
          disabled={loading}
          onChange={(event) =>
            handleCurrencyChange(event.target.value as "BRL" | "EUR")
          }
          value={currency}
        >
          <option value="BRL">Real brasileiro — BRL</option>
          <option value="EUR">Euro — EUR</option>
        </select>
      </label>

      <div className={styles.note}>
        Depois você poderá participar de até 10 Households e ser proprietário
        de até 3 delas.
      </div>

      {error ? <div className={styles.error}>{error}</div> : null}

      <button
        aria-busy={loading}
        className={styles.submit}
        disabled={loading}
        type="submit"
      >
        {loading ? "Criando sua Household..." : "Começar a usar o AUREUM"}
      </button>
    </form>
  );
}
