"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import styles from "./auth.module.css";

type AuthFormProps = {
  mode: "signin" | "signup";
  redirectTo?: string;
  initialError?: string;
};

function translateAuthError(message: string) {
  const normalized = message.toLowerCase();
  if (normalized.includes("invalid login credentials")) return "E-mail ou senha incorretos.";
  if (normalized.includes("email not confirmed")) return "Confirme seu e-mail antes de entrar.";
  if (normalized.includes("user already registered")) return "Já existe uma conta com este e-mail.";
  if (normalized.includes("password")) return "A senha não atende aos requisitos de segurança.";
  return message;
}

export function AuthForm({ mode, redirectTo = "/dashboard", initialError }: AuthFormProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError ?? "");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(""); setMessage("");
    if (password.length < 8) { setError("Use uma senha com pelo menos 8 caracteres."); return; }
    setLoading(true);

    try {
      const supabase = createClient();

      if (mode === "signin") {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (signInError) { setError(translateAuthError(signInError.message)); return; }
        router.push(redirectTo); router.refresh(); return;
      }

      if (!fullName.trim()) { setError("Informe seu nome."); return; }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: fullName.trim() },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
        },
      });

      if (signUpError) { setError(translateAuthError(signUpError.message)); return; }
      if (data.session) { router.push("/onboarding"); router.refresh(); return; }

      setMessage("Conta criada. Confirme seu e-mail para continuar a configuração da sua Household.");
      setPassword("");
    } catch {
      setError("Não foi possível concluir a operação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {mode === "signup" ? (
        <label className={styles.field}>Nome
          <input autoComplete="name" onChange={e => setFullName(e.target.value)} placeholder="Como devemos te chamar?" required type="text" value={fullName} />
        </label>
      ) : null}

      <label className={styles.field}>E-mail
        <input autoComplete="email" inputMode="email" onChange={e => setEmail(e.target.value)} placeholder="voce@email.com" required type="email" value={email} />
      </label>

      <label className={styles.field}>Senha
        <input autoComplete={mode === "signin" ? "current-password" : "new-password"} minLength={8} onChange={e => setPassword(e.target.value)} placeholder="Mínimo de 8 caracteres" required type="password" value={password} />
      </label>

      {error ? <div className={styles.error}>{error}</div> : null}
      {message ? <div className={styles.message}>{message}</div> : null}

      <button className={styles.submit} disabled={loading} type="submit">
        {loading ? "Aguarde..." : mode === "signin" ? "Entrar no AUREUM" : "Continuar"}
      </button>
    </form>
  );
}
