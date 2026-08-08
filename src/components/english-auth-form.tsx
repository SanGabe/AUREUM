"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { EnglishLocale } from "@/i18n/locales";
import { localePrefix } from "@/i18n/locales";
import { getEnglishCopy } from "@/i18n/english-copy";
import styles from "./auth.module.css";

export function EnglishAuthForm({
  locale,
  mode,
  redirectTo,
  initialError,
}: {
  locale: EnglishLocale;
  mode: "signin" | "signup";
  redirectTo?: string;
  initialError?: string;
}) {
  const router = useRouter();
  const t = getEnglishCopy(locale);
  const prefix = localePrefix(locale);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError ?? "");
  const [message, setMessage] = useState("");

  function translate(message: string) {
    const normalized = message.toLowerCase();
    if (normalized.includes("invalid login credentials"))
      return t.auth.invalidCredentials;
    if (normalized.includes("email not confirmed"))
      return t.auth.emailNotConfirmed;
    if (normalized.includes("user already registered"))
      return t.auth.alreadyRegistered;
    if (normalized.includes("password"))
      return t.auth.weakPassword;
    return message;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 8) {
      setError(t.auth.minimumPassword);
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      if (mode === "signin") {
        const { error: signInError } =
          await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

        if (signInError) {
          setError(translate(signInError.message));
          return;
        }

        router.push(redirectTo ?? `${prefix}/dashboard`);
        router.refresh();
        return;
      }

      if (!fullName.trim()) {
        setError(t.auth.nameRequired);
        return;
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            locale,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(`${prefix}/onboarding`)}`,
        },
      });

      if (signUpError) {
        setError(translate(signUpError.message));
        return;
      }

      if (data.session) {
        router.push(`${prefix}/onboarding`);
        router.refresh();
        return;
      }

      setMessage(t.auth.accountCreated);
      setPassword("");
    } catch {
      setError(t.auth.genericError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {mode === "signup" ? (
        <label className={styles.field}>
          {t.auth.name}
          <input
            autoComplete="name"
            onChange={(event) => setFullName(event.target.value)}
            placeholder={t.auth.namePlaceholder}
            required
            type="text"
            value={fullName}
          />
        </label>
      ) : null}

      <label className={styles.field}>
        {t.auth.email}
        <input
          autoComplete="email"
          inputMode="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
          type="email"
          value={email}
        />
      </label>

      <label className={styles.field}>
        {t.auth.password}
        <input
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
          minLength={8}
          onChange={(event) => setPassword(event.target.value)}
          placeholder={t.auth.passwordPlaceholder}
          required
          type="password"
          value={password}
        />
      </label>

      {error ? <div className={styles.error}>{error}</div> : null}
      {message ? <div className={styles.message}>{message}</div> : null}

      <button className={styles.submit} disabled={loading} type="submit">
        {loading
          ? t.auth.wait
          : mode === "signin"
            ? t.auth.entering
            : t.auth.continue}
      </button>
    </form>
  );
}
