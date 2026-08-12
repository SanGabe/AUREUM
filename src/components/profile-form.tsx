"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { AppLocale } from "@/i18n/locales";
import { CountryCallingCodePicker } from "@/components/country-calling-code-picker";
import {
  CALLING_CODES,
  callingCodeByIso,
} from "@/lib/aureum/country-calling-codes";
import {
  formatCpf,
  onlyDigits,
} from "@/lib/aureum/identity-validation";
import styles from "./account-page.module.css";
import extra from "./profile-extra.module.css";

export type ProfileFormData = {
  fullName: string;
  avatarPath: string | null;
  dateOfBirth: string | null;
  cpf: string | null;
  cpfVerifiedAt: string | null;
  phoneCountryIso: string | null;
  phoneCountryCode: string | null;
  phoneAreaCode: string | null;
  phoneNumber: string | null;
  addressCountryCode: string | null;
  addressPostalCode: string | null;
  addressState: string | null;
  addressCity: string | null;
  addressDistrict: string | null;
  addressStreet: string | null;
  addressNumber: string | null;
  addressComplement: string | null;
};

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function errorText(
  code: string,
  locale: AppLocale,
  detail?: string,
) {
  const pt = locale === "pt-BR";

  const map: Record<string, [string, string]> = {
    name_required: [
      "Informe seu nome.",
      "Enter your name.",
    ],
    invalid_cpf: [
      "Informe um CPF válido.",
      "Enter a valid CPF.",
    ],
    invalid_birth_date: [
      "Informe uma data de nascimento válida.",
      "Enter a valid date of birth.",
    ],
    birth_date_required_for_cpf: [
      "A data de nascimento é necessária para validar o CPF.",
      "Date of birth is required to verify the CPF.",
    ],
    identity_rate_limited: [
      "Muitas verificações foram feitas em pouco tempo. Tente novamente mais tarde.",
      "Too many verification requests were made. Try again later.",
    ],
    identity_not_verified: [
      "Não foi possível confirmar o CPF na fonte cadastral oficial.",
      "The CPF could not be confirmed with the official registry.",
    ],
    cpf_already_used: [
      "Este CPF já está associado a outra conta AUREUM.",
      "This CPF is already linked to another AUREUM account.",
    ],
    profile_unavailable: [
      "O perfil está temporariamente indisponível.",
      "The profile is temporarily unavailable.",
    ],
  };

  const item = map[code];

  if (item) return pt ? item[0] : item[1];
  return (
    detail ??
    (pt
      ? "Não foi possível salvar suas informações."
      : "We could not save your information.")
  );
}

export function ProfileForm({
  email,
  initial,
  userId,
  locale = "pt-BR",
}: {
  email: string;
  initial: ProfileFormData;
  userId: string;
  locale?: AppLocale;
}) {
  const router = useRouter();
  const pt = locale === "pt-BR";

  const [fullName, setFullName] = useState(
    initial.fullName,
  );
  const [avatarPath, setAvatarPath] = useState(
    initial.avatarPath,
  );
  const [avatarUrl, setAvatarUrl] = useState<
    string | null
  >(null);

  const [dateOfBirth, setDateOfBirth] = useState(
    initial.dateOfBirth ?? "",
  );
  const [cpf, setCpf] = useState(
    initial.cpf ? formatCpf(initial.cpf) : "",
  );
  const [cpfVerified, setCpfVerified] = useState(
    Boolean(initial.cpfVerifiedAt),
  );

  const initialPhone = callingCodeByIso(
    initial.phoneCountryIso ?? "BR",
  );

  const [phoneCountryIso, setPhoneCountryIso] =
    useState(initialPhone.iso);
  const [phoneCountryCode, setPhoneCountryCode] =
    useState(
      initial.phoneCountryCode ??
        initialPhone.dialCode,
    );
  const [phoneAreaCode, setPhoneAreaCode] =
    useState(initial.phoneAreaCode ?? "");
  const [phoneNumber, setPhoneNumber] = useState(
    initial.phoneNumber ?? "",
  );

  const [addressCountryCode, setAddressCountryCode] =
    useState(
      initial.addressCountryCode ??
        initialPhone.iso,
    );
  const [addressPostalCode, setAddressPostalCode] =
    useState(initial.addressPostalCode ?? "");
  const [addressState, setAddressState] = useState(
    initial.addressState ?? "",
  );
  const [addressCity, setAddressCity] = useState(
    initial.addressCity ?? "",
  );
  const [addressDistrict, setAddressDistrict] =
    useState(initial.addressDistrict ?? "");
  const [addressStreet, setAddressStreet] =
    useState(initial.addressStreet ?? "");
  const [addressNumber, setAddressNumber] =
    useState(initial.addressNumber ?? "");
  const [addressComplement, setAddressComplement] =
    useState(initial.addressComplement ?? "");

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] =
    useState(false);
  const [cropSource, setCropSource] = useState<string | null>(null);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [cropZoom, setCropZoom] = useState(1);
  const [cropX, setCropX] = useState(50);
  const [cropY, setCropY] = useState(50);
  const cropImageRef = useRef<HTMLImageElement | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const maxBirthDate = useMemo(
    () => new Date().toISOString().slice(0, 10),
    [],
  );

  useEffect(() => {
    if (!avatarPath) {
      setAvatarUrl(null);
      return;
    }

    let active = true;

    const supabase = createClient();

    supabase.storage
      .from("profile-avatars")
      .createSignedUrl(avatarPath, 60 * 60)
      .then(({ data }) => {
        if (active) {
          setAvatarUrl(data?.signedUrl ?? null);
        }
      });

    return () => {
      active = false;
    };
  }, [avatarPath]);

  function chooseAvatar(file: File) {
    setError("");
    setMessage("");

    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowed.includes(file.type)) {
      setError(
        pt
          ? "Use uma imagem JPG, PNG ou WebP."
          : "Use a JPG, PNG or WebP image.",
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        pt
          ? "A foto deve ter no máximo 5 MB."
          : "The image must be at most 5 MB.",
      );
      return;
    }

    if (cropSource) URL.revokeObjectURL(cropSource);
    setCropFile(file);
    setCropSource(URL.createObjectURL(file));
    setCropZoom(1);
    setCropX(50);
    setCropY(50);
  }

  function closeCrop() {
    if (cropSource) URL.revokeObjectURL(cropSource);
    setCropSource(null);
    setCropFile(null);
  }

  async function createCroppedAvatar() {
    const image = cropImageRef.current;
    if (!image || !cropFile) return null;
    const canvas = document.createElement("canvas");
    canvas.width = 900;
    canvas.height = 1200;
    const context = canvas.getContext("2d");
    if (!context) return null;

    const targetRatio = canvas.width / canvas.height;
    const imageRatio = image.naturalWidth / image.naturalHeight;
    const baseWidth = imageRatio > targetRatio ? image.naturalHeight * targetRatio : image.naturalWidth;
    const baseHeight = imageRatio > targetRatio ? image.naturalHeight : image.naturalWidth / targetRatio;
    const sourceWidth = baseWidth / cropZoom;
    const sourceHeight = baseHeight / cropZoom;
    const sourceX = Math.max(0, image.naturalWidth - sourceWidth) * (cropX / 100);
    const sourceY = Math.max(0, image.naturalHeight - sourceHeight) * (cropY / 100);
    context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height);

    return new Promise<File | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob ? new File([blob], "avatar-3x4.webp", { type: "image/webp" }) : null), "image/webp", .88);
    });
  }

  async function confirmAvatarCrop() {
    const cropped = await createCroppedAvatar();
    if (!cropped) {
      setError(pt ? "Não foi possível recortar a imagem." : "We could not crop the image.");
      return;
    }
    await uploadAvatar(cropped);
    closeCrop();
  }

  async function uploadAvatar(file: File) {
    setError("");
    setMessage("");

    setUploading(true);

    try {
      const supabase = createClient();

      const extension =
        file.type === "image/png"
          ? "png"
          : file.type === "image/webp"
            ? "webp"
            : "jpg";

      const path = `${userId}/avatar.${extension}`;

      const { error: uploadError } =
        await supabase.storage
          .from("profile-avatars")
          .upload(path, file, {
            upsert: true,
            contentType: file.type,
            cacheControl: "3600",
          });

      if (uploadError) {
        setError(uploadError.message);
        return;
      }

      if (
        avatarPath &&
        avatarPath !== path
      ) {
        await supabase.storage
          .from("profile-avatars")
          .remove([avatarPath]);
      }

      setAvatarPath(path);

      const { data } = await supabase.storage
        .from("profile-avatars")
        .createSignedUrl(path, 60 * 60);

      setAvatarUrl(data?.signedUrl ?? null);

      setMessage(
        pt
          ? "Foto carregada. Salve as alterações para vinculá-la ao perfil."
          : "Photo uploaded. Save changes to link it to your profile.",
      );
    } catch {
      setError(
        pt
          ? "Não foi possível carregar a foto."
          : "We could not upload the photo.",
      );
    } finally {
      setUploading(false);
    }
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          fullName,
          avatarPath,
          dateOfBirth,
          cpf,
          phoneCountryIso,
          phoneCountryCode,
          phoneAreaCode,
          phoneNumber,
          addressCountryCode,
          addressPostalCode,
          addressState,
          addressCity,
          addressDistrict,
          addressStreet,
          addressNumber,
          addressComplement,
        }),
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
        detail?: string;
        cpfVerified?: boolean;
      };

      if (!response.ok || !payload.ok) {
        setError(
          errorText(
            payload.error ?? "profile_unavailable",
            locale,
            payload.detail,
          ),
        );
        return;
      }

      setCpfVerified(Boolean(payload.cpfVerified));

      setMessage(
        pt
          ? "Informações pessoais atualizadas."
          : "Personal information updated.",
      );

      router.refresh();
    } catch {
      setError(
        pt
          ? "Não foi possível atualizar suas informações."
          : "We could not update your information.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className={styles.form}
      onSubmit={save}
    >
      <div className={extra.avatarSection}>
        <div className={extra.avatar}>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={
                pt
                  ? "Foto de perfil"
                  : "Profile photo"
              }
            />
          ) : (
            initials(fullName || "AUREUM")
          )}
        </div>

        <div className={extra.avatarActions}>
          <strong>
            {pt ? "Foto de perfil" : "Profile photo"}
          </strong>
          <p>
            {pt
              ? "JPG, PNG ou WebP. Máximo de 5 MB. A imagem fica em armazenamento privado."
              : "JPG, PNG or WebP. Up to 5 MB. The image is stored privately."}
          </p>

          <label className={extra.uploadButton}>
            {uploading
              ? pt
                ? "Carregando..."
                : "Uploading..."
              : pt
                ? "Escolher foto"
                : "Choose photo"}
            <input
              accept="image/jpeg,image/png,image/webp"
              disabled={uploading}
              onChange={(event) => {
                const file =
                  event.target.files?.[0];
                if (file) chooseAvatar(file);
              }}
              type="file"
            />
          </label>
        </div>
      </div>

      {cropSource ? (
        <div className={extra.cropBackdrop} role="dialog" aria-modal="true" aria-labelledby="crop-title">
          <div className={extra.cropDialog}>
            <div className={extra.cropHeader}>
              <div><strong id="crop-title">{pt ? "Recortar foto em 3:4" : "Crop photo to 3:4"}</strong><p>{pt ? "Ajuste o enquadramento antes de salvar." : "Adjust the framing before saving."}</p></div>
              <button onClick={closeCrop} type="button" aria-label={pt ? "Fechar" : "Close"}>×</button>
            </div>
            <div className={extra.cropStage}>
              <img ref={cropImageRef} src={cropSource} alt={pt ? "Prévia para recorte" : "Crop preview"} style={{ transform: `scale(${cropZoom})`, objectPosition: `${cropX}% ${cropY}%` }} />
              <span aria-hidden="true" />
            </div>
            <div className={extra.cropControls}>
              <label>Zoom<input type="range" min="1" max="3" step="0.05" value={cropZoom} onChange={(event) => setCropZoom(Number(event.target.value))} /></label>
              <label>{pt ? "Horizontal" : "Horizontal"}<input type="range" min="0" max="100" value={cropX} onChange={(event) => setCropX(Number(event.target.value))} /></label>
              <label>{pt ? "Vertical" : "Vertical"}<input type="range" min="0" max="100" value={cropY} onChange={(event) => setCropY(Number(event.target.value))} /></label>
            </div>
            <div className={extra.cropActions}><button onClick={closeCrop} type="button">{pt ? "Cancelar" : "Cancel"}</button><button disabled={uploading} onClick={() => void confirmAvatarCrop()} type="button">{uploading ? (pt ? "Salvando..." : "Saving...") : (pt ? "Usar esta foto" : "Use this photo")}</button></div>
          </div>
        </div>
      ) : null}

      <div className={extra.section}>
        <div className={extra.sectionHeader}>
          <strong>
            {pt
              ? "Identificação"
              : "Identification"}
          </strong>
          <span>
            {pt
              ? "Dados pessoais ligados à sua conta, independentemente do Núcleo."
              : "Personal data linked to your account, independently of any Nucleus."}
          </span>
        </div>

        <div className={extra.grid2}>
          <label>
            {pt ? "Nome completo" : "Full name"}
            <input
              autoComplete="name"
              onChange={(event) =>
                setFullName(event.target.value)
              }
              required
              value={fullName}
            />
          </label>

          <label>
            {pt ? "Data de nascimento" : "Date of birth"}
            <input
              max={maxBirthDate}
              onChange={(event) =>
                setDateOfBirth(event.target.value)
              }
              type="date"
              value={dateOfBirth}
            />
          </label>

          <label>
            CPF
            <input
              inputMode="numeric"
              maxLength={14}
              onChange={(event) => {
                setCpf(
                  formatCpf(event.target.value),
                );
                setCpfVerified(false);
              }}
              placeholder="000.000.000-00"
              value={cpf}
            />
            {cpf ? (
              <span
                className={`${extra.verification} ${
                  cpfVerified
                    ? extra.verified
                    : extra.unverified
                }`}
              >
                {cpfVerified
                  ? pt
                    ? "✓ CPF verificado"
                    : "✓ CPF verified"
                  : pt
                    ? "○ Verificação oficial pendente"
                    : "○ Official verification pending"}
              </span>
            ) : null}
          </label>

          <label>
            E-mail
            <input
              disabled
              type="email"
              value={email}
            />
            <small>
              {pt
                ? "O e-mail de autenticação não é alterado por esta tela."
                : "Your authentication email is not changed on this screen."}
            </small>
          </label>
        </div>
      </div>

      <div className={extra.section}>
        <div className={extra.sectionHeader}>
          <strong>
            {pt ? "Telefone" : "Phone"}
          </strong>
          <span>
            {pt
              ? "O número ainda não exige confirmação por SMS."
              : "The number does not require SMS verification yet."}
          </span>
        </div>

        <div className={extra.phoneGrid}>
          <div className={extra.phonePart}>
            <span>{pt ? "DDI" : "Country code"}</span>
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
            <span>{pt ? "DDD" : "Area code"}</span>
            <input
              inputMode="numeric"
              maxLength={5}
              onChange={(event) =>
                setPhoneAreaCode(
                  onlyDigits(event.target.value),
                )
              }
              value={phoneAreaCode}
            />
          </label>

          <label className={extra.phonePart}>
            <span>{pt ? "Número" : "Number"}</span>
            <input
              autoComplete="tel-national"
              inputMode="tel"
              maxLength={12}
              onChange={(event) =>
                setPhoneNumber(
                  onlyDigits(event.target.value),
                )
              }
              value={phoneNumber}
            />
          </label>
        </div>
      </div>

      <div className={extra.section}>
        <div className={extra.sectionHeader}>
          <strong>
            {pt ? "Endereço" : "Address"}
          </strong>
          <span>
            {pt
              ? "Informações opcionais para personalização e futuros recursos."
              : "Optional information for personalisation and future features."}
          </span>
        </div>

        <div className={extra.grid3}>
          <label>
            {pt ? "País" : "Country"}
            <select
              onChange={(event) =>
                setAddressCountryCode(
                  event.target.value,
                )
              }
              value={addressCountryCode}
            >
              {CALLING_CODES.map((country) => (
                <option
                  key={country.iso}
                  value={country.iso}
                >
                  {country.flag}{" "}
                  {pt
                    ? country.namePt
                    : country.nameEn}
                </option>
              ))}
            </select>
          </label>

          <label>
            {pt ? "CEP / Código postal" : "Postal code"}
            <input
              autoComplete="postal-code"
              onChange={(event) =>
                setAddressPostalCode(
                  event.target.value,
                )
              }
              value={addressPostalCode}
            />
          </label>

          <label>
            {pt ? "Estado / Província" : "State / Province"}
            <input
              autoComplete="address-level1"
              onChange={(event) =>
                setAddressState(event.target.value)
              }
              value={addressState}
            />
          </label>

          <label>
            {pt ? "Cidade" : "City"}
            <input
              autoComplete="address-level2"
              onChange={(event) =>
                setAddressCity(event.target.value)
              }
              value={addressCity}
            />
          </label>

          <label>
            {pt ? "Bairro / Distrito" : "District"}
            <input
              autoComplete="address-level3"
              onChange={(event) =>
                setAddressDistrict(
                  event.target.value,
                )
              }
              value={addressDistrict}
            />
          </label>

          <label>
            {pt ? "Rua / Logradouro" : "Street"}
            <input
              autoComplete="street-address"
              onChange={(event) =>
                setAddressStreet(event.target.value)
              }
              value={addressStreet}
            />
          </label>

          <label>
            {pt ? "Número" : "Number"}
            <input
              onChange={(event) =>
                setAddressNumber(event.target.value)
              }
              value={addressNumber}
            />
          </label>

          <label>
            {pt ? "Complemento" : "Complement"}
            <input
              onChange={(event) =>
                setAddressComplement(
                  event.target.value,
                )
              }
              value={addressComplement}
            />
          </label>
        </div>
      </div>

      {error ? (
        <div className={styles.error}>{error}</div>
      ) : null}

      {message ? (
        <div className={styles.success}>
          {message}
        </div>
      ) : null}

      <button
        disabled={loading || uploading}
        type="submit"
      >
        {loading
          ? pt
            ? "Salvando..."
            : "Saving..."
          : pt
            ? "Salvar alterações"
            : "Save changes"}
      </button>
    </form>
  );
}
