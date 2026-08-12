"use client";

import {
  FormEvent,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  formatCpf,
  normalizeEmail,
  passwordChecks,
} from "@/lib/aureum/identity-validation";
import { CountryCallingCodePicker } from "@/components/country-calling-code-picker";
import { AuthLoadingPopup } from "@/components/auth-loading-popup";
import styles from "./auth.module.css";
import extra from "./auth-extra.module.css";

type AuthFormProps = {
  mode: "signin" | "signup";
  redirectTo?: string;
  initialError?: string;
};

function translateAuthError(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials"))
    return "E-mail ou senha incorretos.";
  if (normalized.includes("email not confirmed"))
    return "Confirme seu e-mail antes de entrar.";
  if (normalized.includes("user already registered"))
    return "Já existe uma conta com este e-mail.";
  if (normalized.includes("password"))
    return "A senha não atende aos requisitos de segurança.";

  return message;
}

function registrationError(code: string, detail?: string) {
  const map: Record<string, string> = {
    name_required: "Informe seu nome.",
    email_mismatch:
      "Os dois campos de e-mail precisam ser iguais.",
    password_mismatch:
      "As duas senhas precisam ser exatamente iguais.",
    weak_password:
      "A senha precisa ter pelo menos 6 caracteres, uma letra, um número e um caractere especial.",
    invalid_cpf:
      "Informe um CPF válido.",
    cpf_already_used:
      "Este CPF já está associado a outra conta AUREUM.",
    invalid_birth_date:
      "Informe uma data de nascimento válida.",
    invalid_phone:
      "Confira DDI, DDD/código de área e número do telefone.",
    identity_rate_limited:
      "Muitas verificações cadastrais foram feitas em pouco tempo. Tente novamente mais tarde.",
    identity_not_verified:
      "Não foi possível confirmar o CPF na fonte cadastral oficial.",
    registration_unavailable:
      "O cadastro está temporariamente indisponível.",
  };

  if (code === "signup_failed" && detail) {
    return translateAuthError(detail);
  }

  return (
    map[code] ??
    "Não foi possível concluir o cadastro. Tente novamente."
  );
}

export function AuthForm({
  mode,
  redirectTo = "/dashboard",
  initialError,
}: AuthFormProps) {
  const router = useRouter();

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
          setError(
            translateAuthError(signInError.message),
          );
          return;
        }

        router.push(redirectTo);
        router.refresh();
      } catch {
        setError(
          "Não foi possível concluir a operação. Tente novamente.",
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
      setError(
        "Os dois campos de e-mail precisam ser iguais.",
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "As duas senhas precisam ser exatamente iguais.",
      );
      return;
    }

    if (!Object.values(checks).every(Boolean)) {
      setError(
        "A senha precisa ter pelo menos 6 caracteres, uma letra, um número e um caractere especial.",
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
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
          locale: "pt-BR",
        }),
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        session?: boolean;
        emailConfirmationRequired?: boolean;
        error?: string;
        detail?: string;
        identity?: {
          officialVerified?: boolean;
          provider?: string;
          status?: string;
        };
      };

      if (!response.ok || !payload.ok) {
        setError(
          registrationError(
            payload.error ?? "registration_unavailable",
            payload.detail,
          ),
        );
        return;
      }

      if (payload.session) {
        router.push("/onboarding");
        router.refresh();
        return;
      }

      setMessage(
        payload.identity?.officialVerified
          ? "Conta criada e CPF verificado. Confirme seu e-mail para continuar a configuração do seu Núcleo."
          : "Conta criada. Confirme seu e-mail para continuar. A verificação oficial do CPF será exibida no seu perfil quando o provedor estiver configurado.",
      );

      setPassword("");
      setConfirmPassword("");
    } catch {
      setError(
        "Não foi possível concluir o cadastro. Tente novamente.",
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
            Nome
            <input
              autoComplete="name"
              onChange={(event) =>
                setFullName(event.target.value)
              }
              placeholder="Como devemos te chamar?"
              required
              type="text"
              value={fullName}
            />
          </label>

          <label className={styles.field}>
            CPF
            <input
              autoComplete="off"
              inputMode="numeric"
              maxLength={14}
              onChange={(event) =>
                setCpf(formatCpf(event.target.value))
              }
              placeholder="000.000.000-00"
              required
              value={cpf}
            />
          </label>

          <label className={styles.field}>
            Data de nascimento
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
            Celular / Telefone
            <div className={extra.phoneGrid}>
              <div className={extra.phonePart}>
                <span>DDI</span>
                <CountryCallingCodePicker
                  locale="pt-BR"
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
                <span>DDD</span>
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
                <span>Número</span>
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
              O telefone será salvo no perfil, mas não
              precisa ser confirmado nesta etapa.
            </small>
          </div>
        </div>
      ) : null}

      <label className={styles.field}>
        E-mail
        <input
          autoComplete="email"
          inputMode="email"
          onChange={(event) =>
            setEmail(event.target.value)
          }
          placeholder="voce@email.com"
          required
          type="email"
          value={email}
        />
      </label>

      {mode === "signup" ? (
        <label className={styles.field}>
          Confirmar e-mail
          <input
            autoComplete="email"
            inputMode="email"
            onChange={(event) =>
              setConfirmEmail(event.target.value)
            }
            placeholder="Digite o e-mail novamente"
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
                ? "✓ Os e-mails coincidem."
                : "✕ Os e-mails são diferentes."}
            </small>
          ) : null}
        </label>
      ) : null}

      <label className={styles.field}>
        Senha
        <input
          autoComplete={
            mode === "signin"
              ? "current-password"
              : "new-password"
          }
          minLength={mode === "signup" ? 6 : undefined}
          onChange={(event) =>
            setPassword(event.target.value)
          }
          placeholder={
            mode === "signup"
              ? "Mín. 6 + letra + número + especial"
              : "Sua senha"
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
              {checks.minimumLength ? "✓" : "○"} 6 ou mais caracteres
            </span>
            <span className={checks.letter ? extra.ok : ""}>
              {checks.letter ? "✓" : "○"} Pelo menos 1 letra
            </span>
            <span className={checks.number ? extra.ok : ""}>
              {checks.number ? "✓" : "○"} Pelo menos 1 número
            </span>
            <span className={checks.special ? extra.ok : ""}>
              {checks.special ? "✓" : "○"} Pelo menos 1 caractere especial
            </span>
          </div>

          <label className={styles.field}>
            Confirmar senha
            <input
              autoComplete="new-password"
              minLength={6}
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value,
                )
              }
              placeholder="Digite a senha novamente"
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
                  ? "✓ As senhas coincidem."
                  : "✕ As senhas são diferentes. Maiúsculas e minúsculas importam."}
              </small>
            ) : null}
          </label>

          <p className={extra.identityNote}>
            O CPF é validado estruturalmente e, quando
            o provedor oficial estiver habilitado no
            servidor, também será consultado na fonte
            cadastral antes da criação da conta.
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
          ? "Aguarde..."
          : mode === "signin"
            ? "Entrar no AUREUM"
            : "Criar conta"}
      </button>
      {loading && mode === "signin" ? <AuthLoadingPopup /> : null}
    </form>
  );
}
