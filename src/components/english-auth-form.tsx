"use client";

import {
  FormEvent,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { EnglishLocale } from "@/i18n/locales";
import { localePrefix } from "@/i18n/locales";
import { CountryCallingCodePicker } from "@/components/country-calling-code-picker";
import {
  formatCpf,
  normalizeEmail,
  passwordChecks,
} from "@/lib/aureum/identity-validation";
import styles from "./auth.module.css";
import extra from "./auth-extra.module.css";

function signupError(code: string, detail?: string) {
  const map: Record<string, string> = {
    name_required: "Enter your name.",
    email_mismatch:
      "Both email fields must match.",
    password_mismatch:
      "Both passwords must match exactly.",
    weak_password:
      "Use at least 6 characters, including a letter, a number and a special character.",
    invalid_cpf:
      "Enter a valid Brazilian CPF.",
    cpf_already_used:
      "This CPF is already linked to another AUREUM account.",
    invalid_birth_date:
      "Enter a valid date of birth.",
    invalid_phone:
      "Check the country code, area code and phone number.",
    identity_rate_limited:
      "Too many identity checks were requested. Try again later.",
    identity_not_verified:
      "We could not confirm this CPF with the configured official registry.",
    registration_unavailable:
      "Registration is temporarily unavailable.",
  };

  if (code === "signup_failed" && detail) {
    const normalized = detail.toLowerCase();

    if (normalized.includes("already registered"))
      return "An account already exists for this email.";
    if (normalized.includes("password"))
      return map.weak_password;

    return detail;
  }

  return (
    map[code] ??
    "We could not complete registration. Please try again."
  );
}

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
  const prefix = localePrefix(locale);

  const [fullName, setFullName] = useState("");
  const [cpf, setCpf] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phoneCountryIso, setPhoneCountryIso] =
    useState("BR");
  const [phoneCountryCode, setPhoneCountryCode] =
    useState("+55");
  const [phoneAreaCode, setPhoneAreaCode] =
    useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(
    initialError ?? "",
  );
  const [message, setMessage] = useState("");

  const checks = useMemo(
    () => passwordChecks(password),
    [password],
  );

  const emailsMatch =
    !confirmEmail ||
    normalizeEmail(email) ===
      normalizeEmail(confirmEmail);

  const passwordsMatch =
    !confirmPassword ||
    password === confirmPassword;

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (mode === "signin") {
      setLoading(true);

      try {
        const supabase = createClient();
        const { error: signInError } =
          await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

        if (signInError) {
          const normalized =
            signInError.message.toLowerCase();

          if (
            normalized.includes(
              "invalid login credentials",
            )
          ) {
            setError("Incorrect email or password.");
          } else if (
            normalized.includes("email not confirmed")
          ) {
            setError(
              "Confirm your email before signing in.",
            );
          } else {
            setError(signInError.message);
          }

          return;
        }

        router.push(
          redirectTo ?? `${prefix}/dashboard`,
        );
        router.refresh();
      } catch {
        setError(
          "We could not complete the operation. Please try again.",
        );
      } finally {
        setLoading(false);
      }

      return;
    }

    if (
      normalizeEmail(email) !==
      normalizeEmail(confirmEmail)
    ) {
      setError("Both email fields must match.");
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Both passwords must match exactly.",
      );
      return;
    }

    if (!Object.values(checks).every(Boolean)) {
      setError(
        "Use at least 6 characters, including a letter, a number and a special character.",
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            fullName,
            cpf,
            birthDate,
            phoneCountryIso,
            phoneCountryCode,
            phoneAreaCode,
            phoneNumber,
            email,
            confirmEmail,
            password,
            confirmPassword,
            locale,
          }),
        },
      );

      const payload = (await response.json()) as {
        ok?: boolean;
        session?: boolean;
        error?: string;
        detail?: string;
        identity?: {
          officialVerified?: boolean;
        };
      };

      if (!response.ok || !payload.ok) {
        setError(
          signupError(
            payload.error ??
              "registration_unavailable",
            payload.detail,
          ),
        );
        return;
      }

      if (payload.session) {
        router.push(`${prefix}/onboarding`);
        router.refresh();
        return;
      }

      setMessage(
        payload.identity?.officialVerified
          ? "Account created and CPF verified. Confirm your email to continue."
          : "Account created. Confirm your email to continue. Official CPF verification will appear in your profile when a registry provider is configured.",
      );

      setPassword("");
      setConfirmPassword("");
    } catch {
      setError(
        "We could not complete registration. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
    >
      {mode === "signup" ? (
        <div className={extra.signupGrid}>
          <label
            className={`${styles.field} ${extra.full}`}
          >
            Name
            <input
              autoComplete="name"
              onChange={(event) =>
                setFullName(event.target.value)
              }
              placeholder="How should we address you?"
              required
              type="text"
              value={fullName}
            />
          </label>

          <label className={styles.field}>
            CPF (Brazilian tax ID)
            <input
              autoComplete="off"
              inputMode="numeric"
              maxLength={14}
              onChange={(event) =>
                setCpf(
                  formatCpf(event.target.value),
                )
              }
              placeholder="000.000.000-00"
              required
              value={cpf}
            />
          </label>

          <label className={styles.field}>
            Date of birth
            <input
              max={new Date()
                .toISOString()
                .slice(0, 10)}
              onChange={(event) =>
                setBirthDate(event.target.value)
              }
              required
              type="date"
              value={birthDate}
            />
          </label>

          <div
            className={`${styles.field} ${extra.full}`}
          >
            Mobile / Phone
            <div className={extra.phoneGrid}>
              <div className={extra.phonePart}>
                <span>Country code</span>
                <CountryCallingCodePicker
                  locale={locale}
                  onChange={(value) => {
                    setPhoneCountryIso(value.iso);
                    setPhoneCountryCode(
                      value.dialCode,
                    );
                  }}
                  value={phoneCountryIso}
                />
              </div>

              <label className={extra.phonePart}>
                <span>Area code</span>
                <input
                  inputMode="numeric"
                  maxLength={5}
                  onChange={(event) =>
                    setPhoneAreaCode(
                      event.target.value.replace(
                        /\D/g,
                        "",
                      ),
                    )
                  }
                  placeholder="74"
                  required
                  value={phoneAreaCode}
                />
              </label>

              <label className={extra.phonePart}>
                <span>Number</span>
                <input
                  autoComplete="tel-national"
                  inputMode="tel"
                  maxLength={12}
                  onChange={(event) =>
                    setPhoneNumber(
                      event.target.value.replace(
                        /\D/g,
                        "",
                      ),
                    )
                  }
                  placeholder="999999999"
                  required
                  value={phoneNumber}
                />
              </label>
            </div>
            <small className={extra.identityNote}>
              Phone verification is not required at
              this stage.
            </small>
          </div>
        </div>
      ) : null}

      <label className={styles.field}>
        Email
        <input
          autoComplete="email"
          inputMode="email"
          onChange={(event) =>
            setEmail(event.target.value)
          }
          placeholder="you@example.com"
          required
          type="email"
          value={email}
        />
      </label>

      {mode === "signup" ? (
        <label className={styles.field}>
          Confirm email
          <input
            autoComplete="email"
            inputMode="email"
            onChange={(event) =>
              setConfirmEmail(event.target.value)
            }
            placeholder="Enter your email again"
            required
            type="email"
            value={confirmEmail}
          />
          {confirmEmail ? (
            <small
              className={
                emailsMatch
                  ? extra.match
                  : extra.mismatch
              }
            >
              {emailsMatch
                ? "✓ Emails match."
                : "✕ Emails do not match."}
            </small>
          ) : null}
        </label>
      ) : null}

      <label className={styles.field}>
        Password
        <input
          autoComplete={
            mode === "signin"
              ? "current-password"
              : "new-password"
          }
          minLength={
            mode === "signup" ? 6 : undefined
          }
          onChange={(event) =>
            setPassword(event.target.value)
          }
          placeholder={
            mode === "signup"
              ? "6+ chars + letter + number + special"
              : "Your password"
          }
          required
          type="password"
          value={password}
        />
      </label>

      {mode === "signup" ? (
        <>
          <div className={extra.passwordRules}>
            <span className={checks.minimumLength ? extra.ok : ""}>
              {checks.minimumLength ? "✓" : "○"} 6 or more characters
            </span>
            <span className={checks.letter ? extra.ok : ""}>
              {checks.letter ? "✓" : "○"} At least 1 letter
            </span>
            <span className={checks.number ? extra.ok : ""}>
              {checks.number ? "✓" : "○"} At least 1 number
            </span>
            <span className={checks.special ? extra.ok : ""}>
              {checks.special ? "✓" : "○"} At least 1 special character
            </span>
          </div>

          <label className={styles.field}>
            Confirm password
            <input
              autoComplete="new-password"
              minLength={6}
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value,
                )
              }
              placeholder="Enter your password again"
              required
              type="password"
              value={confirmPassword}
            />
            {confirmPassword ? (
              <small
                className={
                  passwordsMatch
                    ? extra.match
                    : extra.mismatch
                }
              >
                {passwordsMatch
                  ? "✓ Passwords match."
                  : "✕ Passwords differ. Passwords are case-sensitive."}
              </small>
            ) : null}
          </label>

          <p className={extra.identityNote}>
            CPF structure is always validated. When
            the official registry provider is enabled
            on the server, the CPF is also checked
            against that source before the account is
            created.
          </p>
        </>
      ) : null}

      {error ? (
        <div className={styles.error}>{error}</div>
      ) : null}

      {message ? (
        <div className={styles.message}>
          {message}
        </div>
      ) : null}

      <button
        className={styles.submit}
        disabled={loading}
        type="submit"
      >
        {loading
          ? "Please wait..."
          : mode === "signin"
            ? "Sign in to AUREUM"
            : "Create account"}
      </button>
    </form>
  );
}
