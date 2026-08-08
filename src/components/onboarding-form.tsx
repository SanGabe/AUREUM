"use client";

import { FormEvent, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import styles from "./onboarding-form.module.css";

type HouseholdType = "personal" | "couple" | "family";
type Mode = "choose" | "create" | "join";

type Props = {
  userId: string;
  pendingRequest: { id: string; householdName: string | null } | null;
};

function normalizeCode(value: string) {
  const raw = value.trim().toUpperCase().replace(/\s+/g, "");
  if (!raw) return "";
  return raw.startsWith("AUR-") ? raw : `AUR-${raw.replace(/^AUR-?/, "")}`;
}

function friendlyError(message: string) {
  if (message.includes("HOUSEHOLD_ACCESS_LIMIT_REACHED"))
    return "Você já atingiu o limite de 10 Núcleos acessíveis.";
  if (message.includes("HOUSEHOLD_OWNER_LIMIT_REACHED"))
    return "Você já é proprietário de 3 Núcleos.";
  if (
    message.toLowerCase().includes("invalid") ||
    message.toLowerCase().includes("code")
  )
    return "Código AUREUM inválido ou indisponível.";
  return message;
}

export function OnboardingForm({ userId, pendingRequest }: Props) {
  const lock = useRef(false);
  const [mode, setMode] = useState<Mode>("choose");
  const [name, setName] = useState("");
  const [type, setType] = useState<HouseholdType>("personal");
  const [currency, setCurrency] = useState<"BRL" | "EUR">("BRL");
  const [country, setCountry] = useState<"BR" | "PT">("BR");
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function changeCurrency(value: "BRL" | "EUR") {
    setCurrency(value);
    setCountry(value === "EUR" ? "PT" : "BR");
  }

  async function createHousehold(event: FormEvent) {
    event.preventDefault();
    if (lock.current) return;

    const trimmed = name.trim();
    if (!trimmed) {
      setError("Escolha um nome para seu Núcleo.");
      return;
    }

    lock.current = true;
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();

      const { data: existing } = await supabase
        .from("household_members")
        .select("household_id")
        .eq("user_id", userId)
        .limit(1)
        .maybeSingle();

      if (existing) {
        window.location.replace("/dashboard");
        return;
      }

      const { data: household, error: insertError } = await supabase
        .from("households")
        .insert({
          name: trimmed,
          type,
          default_currency: currency,
          country_code: country,
          created_by: userId,
        })
        .select("id")
        .single();

      if (insertError) {
        setError(friendlyError(insertError.message));
        return;
      }

      if (!household) {
        setError("Não foi possível confirmar a criação do Núcleo.");
        return;
      }

      const { data: membership } = await supabase
        .from("household_members")
        .select("role")
        .eq("household_id", household.id)
        .eq("user_id", userId)
        .maybeSingle();

      if (!membership) {
        setError(
          "O Núcleo foi criado, mas o vínculo de proprietário ainda não foi confirmado.",
        );
        return;
      }

      window.location.replace("/dashboard");
    } catch {
      setError("Não foi possível concluir a criação. Tente novamente.");
    } finally {
      lock.current = false;
      setLoading(false);
    }
  }

  async function joinHousehold(event: FormEvent) {
    event.preventDefault();
    if (lock.current) return;

    const code = normalizeCode(joinCode);

    if (!/^AUR-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{8}$/.test(code)) {
      setError("Use um código AUREUM no formato AUR-XXXXXXXX.");
      return;
    }

    lock.current = true;
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();

      const { error: requestError } = await supabase
        .from("household_join_requests")
        .insert({ requester_id: userId, code_input: code });

      if (requestError) {
        setError(friendlyError(requestError.message));
        return;
      }

      window.location.reload();
    } catch {
      setError("Não foi possível enviar a solicitação. Tente novamente.");
    } finally {
      lock.current = false;
      setLoading(false);
    }
  }

  async function cancelRequest() {
    if (!pendingRequest || lock.current) return;

    lock.current = true;
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();

      const { error: cancelError } = await supabase
        .from("household_join_requests")
        .update({ status: "cancelled" })
        .eq("id", pendingRequest.id)
        .eq("requester_id", userId);

      if (cancelError) {
        setError(cancelError.message);
        return;
      }

      window.location.reload();
    } finally {
      lock.current = false;
      setLoading(false);
    }
  }

  if (pendingRequest) {
    return (
      <section className={styles.pending}>
        <span className={styles.pendingIcon}>⌛</span>
        <div>
          <p className={styles.kicker}>SOLICITAÇÃO ENVIADA</p>
          <h2>Aguardando aprovação.</h2>
          <p>
            {pendingRequest.householdName ? (
              <>
                Sua solicitação para entrar no Núcleo{" "}
                <strong>{pendingRequest.householdName}</strong> está pendente.
              </>
            ) : (
              "Sua solicitação para entrar no Núcleo está pendente."
            )}
          </p>
          <p className={styles.muted}>
            Assim que um proprietário ou administrador aprovar, seu acesso será
            liberado como Membro.
          </p>
        </div>

        <div className={styles.pendingActions}>
          <button
            className={styles.primary}
            onClick={() => window.location.reload()}
            type="button"
          >
            Atualizar status
          </button>
          <button
            className={styles.secondary}
            disabled={loading}
            onClick={cancelRequest}
            type="button"
          >
            Cancelar solicitação
          </button>
        </div>

        {error ? <div className={styles.error}>{error}</div> : null}
      </section>
    );
  }

  if (mode === "choose") {
    return (
      <div className={styles.chooseGrid}>
        <button
          className={styles.choice}
          onClick={() => setMode("create")}
          type="button"
        >
          <span className={styles.choiceNumber}>01</span>
          <h2>Criar um novo Núcleo</h2>
          <p>
            Abra seu próprio espaço financeiro. Você será o proprietário e
            poderá convidar pessoas depois.
          </p>
          <strong>Criar meu Núcleo →</strong>
        </button>

        <button
          className={styles.choice}
          onClick={() => setMode("join")}
          type="button"
        >
          <span className={styles.choiceNumber}>02</span>
          <h2>Já faço parte de um Núcleo</h2>
          <p>
            Use o código AUREUM compartilhado pela sua família, parceiro ou
            responsável pelo espaço.
          </p>
          <strong>Entrar com código →</strong>
        </button>
      </div>
    );
  }

  if (mode === "join") {
    return (
      <form className={styles.form} onSubmit={joinHousehold}>
        <button
          className={styles.back}
          onClick={() => {
            setMode("choose");
            setError("");
          }}
          type="button"
        >
          ← Voltar
        </button>

        <div className={styles.sectionHeading}>
          <p className={styles.kicker}>ENTRAR EM UM NÚCLEO</p>
          <h2>Digite o código do Núcleo.</h2>
          <p>
            O código identifica o Núcleo, mas não libera acesso
            automaticamente. Um administrador precisa aprovar sua entrada.
          </p>
        </div>

        <label className={styles.field}>
          Código AUREUM
          <input
            autoFocus
            disabled={loading}
            maxLength={12}
            onChange={(event) => setJoinCode(event.target.value.toUpperCase())}
            placeholder="AUR-7K3M9QPX"
            value={joinCode}
          />
        </label>

        {error ? <div className={styles.error}>{error}</div> : null}

        <button
          className={styles.primary}
          disabled={loading}
          type="submit"
        >
          {loading ? "Enviando..." : "Solicitar entrada"}
        </button>
      </form>
    );
  }

  return (
    <form className={styles.form} onSubmit={createHousehold}>
      <button
        className={styles.back}
        onClick={() => {
          setMode("choose");
          setError("");
        }}
        type="button"
      >
        ← Voltar
      </button>

      <div className={styles.sectionHeading}>
        <p className={styles.kicker}>CRIAR NÚCLEO</p>
        <h2>Crie seu espaço financeiro.</h2>
      </div>

      <label className={styles.field}>
        Nome do Núcleo
        <input
          autoFocus
          disabled={loading}
          maxLength={80}
          onChange={(event) => setName(event.target.value)}
          placeholder="Ex.: Nossa casa"
          required
          value={name}
        />
      </label>

      <fieldset className={styles.fieldset} disabled={loading}>
        <legend>Como você vai usar o AUREUM?</legend>
        <div className={styles.options}>
          {[
            ["personal", "Pessoal", "Para organizar suas próprias finanças."],
            ["couple", "Casal", "Um espaço compartilhado por duas pessoas."],
            ["family", "Família", "Para organizar finanças de vários membros."],
          ].map(([value, title, copy]) => (
            <label className={styles.option} key={value}>
              <input
                checked={type === value}
                name="type"
                onChange={() => setType(value as HouseholdType)}
                type="radio"
              />
              <span>
                <strong>{title}</strong>
                <small>{copy}</small>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className={styles.field}>
        Moeda principal
        <select
          disabled={loading}
          onChange={(event) =>
            changeCurrency(event.target.value as "BRL" | "EUR")
          }
          value={currency}
        >
          <option value="BRL">Real brasileiro — BRL</option>
          <option value="EUR">Euro — EUR</option>
        </select>
      </label>

      <p className={styles.muted}>
        Depois você poderá acessar até 10 Núcleos e ser proprietário de até 3.
      </p>

      {error ? <div className={styles.error}>{error}</div> : null}

      <button className={styles.primary} disabled={loading} type="submit">
        {loading ? "Criando..." : "Criar Núcleo"}
      </button>
    </form>
  );
}
