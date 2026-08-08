"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { AppLocale } from "@/i18n/locales";
import styles from "./finance-page.module.css";

function normalize(value: string) {
  const raw = value.trim().toUpperCase().replace(/\s+/g, "");
  if (!raw) return "";
  return raw.startsWith("AUR-")
    ? raw
    : `AUR-${raw.replace(/^AUR-?/, "")}`;
}

export function NucleusJoinForm({
  locale,
  userId,
}: {
  locale: AppLocale;
  userId: string;
}) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalized = normalize(code);

    if (!/^AUR-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{8}$/.test(normalized)) {
      setError(
        locale === "pt-BR"
          ? "Use um código no formato AUR-XXXXXXXX."
          : "Use a code in the format AUR-XXXXXXXX.",
      );
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const supabase = createClient();

      const { error: insertError } = await supabase
        .from("household_join_requests")
        .insert({
          requester_id: userId,
          code_input: normalized,
        });

      if (insertError) {
        const raw = insertError.message.toLowerCase();

        if (raw.includes("already a member")) {
          setError(
            locale === "pt-BR"
              ? "Você já faz parte deste Núcleo."
              : "You already belong to this Nucleus.",
          );
        } else if (raw.includes("pending")) {
          setError(
            locale === "pt-BR"
              ? "Já existe uma solicitação pendente para este Núcleo."
              : "A pending request already exists for this Nucleus.",
          );
        } else if (raw.includes("invalid") || raw.includes("disabled")) {
          setError(
            locale === "pt-BR"
              ? "Código inválido ou desativado."
              : "Invalid or disabled code.",
          );
        } else {
          setError(insertError.message);
        }

        return;
      }

      setMessage(
        locale === "pt-BR"
          ? "Solicitação enviada. Um administrador do Núcleo precisa aprová-la."
          : "Request sent. A Nucleus administrator must approve it.",
      );
      setCode("");
      router.refresh();
    } catch {
      setError(
        locale === "pt-BR"
          ? "Não foi possível enviar a solicitação."
          : "We could not send the request.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.formCard}>
      <h2>
        {locale === "pt-BR"
          ? "Entrar em um Núcleo existente"
          : "Join an existing Nucleus"}
      </h2>

      <form onSubmit={submit}>
        <label className={styles.field}>
          {locale === "pt-BR" ? "Código do Núcleo" : "Nucleus code"}
          <input
            autoComplete="off"
            maxLength={12}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            placeholder="AUR-7K3M9QPX"
            value={code}
          />
        </label>

        <div className={styles.notice}>
          {locale === "pt-BR"
            ? "O código identifica o Núcleo, mas não concede acesso automaticamente. A entrada precisa ser aprovada por um Proprietário ou Administrador."
            : "The code identifies the Nucleus, but does not grant access automatically. An Owner or Administrator must approve your request."}
        </div>

        {error ? <div className={styles.error}>{error}</div> : null}
        {message ? <div className={styles.success}>{message}</div> : null}

        <button
          className={styles.primaryButton}
          disabled={loading}
          type="submit"
        >
          {loading
            ? locale === "pt-BR"
              ? "Enviando..."
              : "Sending..."
            : locale === "pt-BR"
              ? "Solicitar entrada"
              : "Request access"}
        </button>
      </form>
    </div>
  );
}
