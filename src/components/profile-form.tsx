"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import styles from "./account-page.module.css";

export function ProfileForm({
  email,
  initialName,
  userId,
}: {
  email: string;
  initialName: string;
  userId: string;
}) {
  const router = useRouter();
  const [fullName, setFullName] = useState(initialName);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function save(event: FormEvent) {
    event.preventDefault();
    const name = fullName.trim();

    if (!name) {
      setError("Informe seu nome.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const supabase = createClient();

      const { error: profileError } = await supabase
        .from("profiles")
        .update({ full_name: name })
        .eq("id", userId);

      if (profileError) {
        setError(profileError.message);
        return;
      }

      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: name },
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      setMessage("Informações atualizadas.");
      router.refresh();
    } catch {
      setError("Não foi possível atualizar suas informações.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={save}>
      <label>
        Nome
        <input
          autoComplete="name"
          onChange={(event) => setFullName(event.target.value)}
          required
          value={fullName}
        />
      </label>

      <label>
        E-mail
        <input disabled type="email" value={email} />
        <small>O e-mail de autenticação não é alterado por esta tela.</small>
      </label>

      {error ? <div className={styles.error}>{error}</div> : null}
      {message ? <div className={styles.success}>{message}</div> : null}

      <button disabled={loading} type="submit">
        {loading ? "Salvando..." : "Salvar alterações"}
      </button>
    </form>
  );
}
