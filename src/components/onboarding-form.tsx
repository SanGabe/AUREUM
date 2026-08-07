"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import styles from "./onboarding-form.module.css";

type OnboardingFormProps = {
  userId: string;
};

type HouseholdType = "personal" | "couple" | "family";

export function OnboardingForm({ userId }: OnboardingFormProps) {
  const router = useRouter();
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Escolha um nome para seu espaço financeiro.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { error: insertError } = await supabase.from("households").insert({
        name: trimmedName,
        type,
        default_currency: currency,
        country_code: country,
        created_by: userId,
      });

      if (insertError) {
        setError(`Não foi possível criar o espaço: ${insertError.message}`);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Não foi possível concluir a configuração. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        Nome do espaço
        <input
          autoFocus
          maxLength={80}
          onChange={(event) => setName(event.target.value)}
          placeholder="Ex.: Minhas finanças, Nossa casa..."
          required
          type="text"
          value={name}
        />
      </label>

      <fieldset className={styles.fieldset}>
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
        Você poderá adicionar contas e transações em outras moedas depois.
      </div>

      {error ? <div className={styles.error}>{error}</div> : null}

      <button className={styles.submit} disabled={loading} type="submit">
        {loading ? "Criando espaço..." : "Começar a usar o AUREUM"}
      </button>
    </form>
  );
}
