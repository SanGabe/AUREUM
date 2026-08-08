"use client";

import { FormEvent, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CurrencySelect } from "@/components/currency-select";
import type { EnglishLocale } from "@/i18n/locales";
import {
  localeDefaultCountry,
  localeDefaultCurrency,
  localePrefix,
} from "@/i18n/locales";
import { getEnglishCopy } from "@/i18n/english-copy";
import styles from "./onboarding-form.module.css";

type NucleusType = "personal" | "couple" | "family";
type Mode = "choose" | "create" | "join";

export function EnglishOnboardingForm({
  locale,
  pendingRequest,
  userId,
}: {
  locale: EnglishLocale;
  pendingRequest: { id: string; householdName: string | null } | null;
  userId: string;
}) {
  const t = getEnglishCopy(locale);
  const prefix = localePrefix(locale);
  const lock = useRef(false);

  const [mode, setMode] = useState<Mode>("choose");
  const [name, setName] = useState("");
  const [type, setType] = useState<NucleusType>("personal");
  const [currency, setCurrency] = useState(
    localeDefaultCurrency(locale),
  );
  const [country, setCountry] = useState(
    localeDefaultCountry(locale),
  );
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function normaliseCode(value: string) {
    const raw = value.trim().toUpperCase().replace(/\s+/g, "");
    if (!raw) return "";
    return raw.startsWith("AUR-")
      ? raw
      : `AUR-${raw.replace(/^AUR-?/, "")}`;
  }

  function friendlyError(message: string) {
    if (message.includes("HOUSEHOLD_ACCESS_LIMIT_REACHED"))
      return t.onboarding.accessLimit;
    if (message.includes("HOUSEHOLD_OWNER_LIMIT_REACHED"))
      return t.onboarding.ownerLimit;
    if (
      message.toLowerCase().includes("invalid") ||
      message.toLowerCase().includes("code")
    )
      return t.onboarding.invalidOrUnavailable;
    return message;
  }

  async function createNucleus(event: FormEvent) {
    event.preventDefault();
    if (lock.current) return;

    const trimmed = name.trim();
    if (!trimmed) {
      setError(t.onboarding.nameRequired);
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
        window.location.replace(`${prefix}/dashboard`);
        return;
      }

      const { data: nucleus, error: insertError } = await supabase
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

      if (!nucleus) {
        setError(t.onboarding.createFailed);
        return;
      }

      const { data: membership } = await supabase
        .from("household_members")
        .select("role")
        .eq("household_id", nucleus.id)
        .eq("user_id", userId)
        .maybeSingle();

      if (!membership) {
        setError(t.onboarding.membershipFailed);
        return;
      }

      window.location.replace(`${prefix}/dashboard`);
    } catch {
      setError(t.onboarding.genericCreateError);
    } finally {
      lock.current = false;
      setLoading(false);
    }
  }

  async function joinNucleus(event: FormEvent) {
    event.preventDefault();
    if (lock.current) return;

    const code = normaliseCode(joinCode);

    if (!/^AUR-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{8}$/.test(code)) {
      setError(t.onboarding.invalidCode);
      return;
    }

    lock.current = true;
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();

      const { error: requestError } = await supabase
        .from("household_join_requests")
        .insert({
          requester_id: userId,
          code_input: code,
        });

      if (requestError) {
        setError(friendlyError(requestError.message));
        return;
      }

      window.location.reload();
    } catch {
      setError(t.onboarding.genericJoinError);
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
          <p className={styles.kicker}>{t.onboarding.pendingKicker}</p>
          <h2>{t.onboarding.pendingTitle}</h2>
          <p>
            {pendingRequest.householdName ? (
              <>
                {t.onboarding.pendingPrefix}{" "}
                <strong>{pendingRequest.householdName}</strong>{" "}
                {t.onboarding.pendingSuffix}
              </>
            ) : (
              t.onboarding.pendingGeneric
            )}
          </p>
          <p className={styles.muted}>{t.onboarding.pendingHelp}</p>
        </div>

        <div className={styles.pendingActions}>
          <button
            className={styles.primary}
            onClick={() => window.location.reload()}
            type="button"
          >
            {t.onboarding.refresh}
          </button>
          <button
            className={styles.secondary}
            disabled={loading}
            onClick={cancelRequest}
            type="button"
          >
            {t.onboarding.cancel}
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
          <h2>{t.onboarding.create}</h2>
          <p>{t.onboarding.createText}</p>
          <strong>{t.onboarding.createAction}</strong>
        </button>

        <button
          className={styles.choice}
          onClick={() => setMode("join")}
          type="button"
        >
          <span className={styles.choiceNumber}>02</span>
          <h2>{t.onboarding.join}</h2>
          <p>{t.onboarding.joinText}</p>
          <strong>{t.onboarding.joinAction}</strong>
        </button>
      </div>
    );
  }

  if (mode === "join") {
    return (
      <form className={styles.form} onSubmit={joinNucleus}>
        <button
          className={styles.back}
          onClick={() => {
            setMode("choose");
            setError("");
          }}
          type="button"
        >
          {t.onboarding.back}
        </button>

        <div className={styles.sectionHeading}>
          <p className={styles.kicker}>{t.onboarding.joinKicker}</p>
          <h2>{t.onboarding.joinTitle}</h2>
          <p>{t.onboarding.joinInfo}</p>
        </div>

        <label className={styles.field}>
          {t.onboarding.code}
          <input
            autoFocus
            disabled={loading}
            maxLength={12}
            onChange={(event) =>
              setJoinCode(event.target.value.toUpperCase())
            }
            placeholder="AUR-7K3M9QPX"
            value={joinCode}
          />
        </label>

        {error ? <div className={styles.error}>{error}</div> : null}

        <button className={styles.primary} disabled={loading} type="submit">
          {loading ? t.onboarding.sending : t.onboarding.request}
        </button>
      </form>
    );
  }

  return (
    <form className={styles.form} onSubmit={createNucleus}>
      <button
        className={styles.back}
        onClick={() => {
          setMode("choose");
          setError("");
        }}
        type="button"
      >
        {t.onboarding.back}
      </button>

      <div className={styles.sectionHeading}>
        <p className={styles.kicker}>{t.onboarding.createKicker}</p>
        <h2>{t.onboarding.createTitle}</h2>
      </div>

      <label className={styles.field}>
        {t.onboarding.name}
        <input
          autoFocus
          disabled={loading}
          maxLength={80}
          onChange={(event) => setName(event.target.value)}
          placeholder={t.onboarding.namePlaceholder}
          required
          value={name}
        />
      </label>

      <fieldset className={styles.fieldset} disabled={loading}>
        <legend>{t.onboarding.usage}</legend>
        <div className={styles.options}>
          {[
            ["personal", t.onboarding.personal, t.onboarding.personalText],
            ["couple", t.onboarding.couple, t.onboarding.coupleText],
            ["family", t.onboarding.family, t.onboarding.familyText],
          ].map(([value, title, copy]) => (
            <label className={styles.option} key={value}>
              <input
                checked={type === value}
                name="type"
                onChange={() => setType(value as NucleusType)}
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
        {t.onboarding.mainCurrency}
        <CurrencySelect
          disabled={loading}
          locale={locale}
          onChange={(value) => {
            setCurrency(value);

            if (value === "USD") setCountry("US");
            else if (value === "GBP") setCountry("GB");
            else if (value === "EUR") setCountry("PT");
            else if (value === "BRL") setCountry("BR");
          }}
          value={currency}
        />
      </label>

      <p className={styles.muted}>{t.onboarding.limitText}</p>

      {error ? <div className={styles.error}>{error}</div> : null}

      <button className={styles.primary} disabled={loading} type="submit">
        {loading ? t.onboarding.creating : t.onboarding.createButton}
      </button>
    </form>
  );
}
