import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  isStrongEnoughPassword,
  isValidCpf,
  normalizeEmail,
  onlyDigits,
} from "@/lib/aureum/identity-validation";
import {
  officialVerificationRequired,
  verifyIdentityDocument,
} from "@/lib/aureum/identity-provider";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function validBirthDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return false;

  const today = new Date();
  return date.getTime() <= today.getTime();
}

function validPhone(input: {
  iso: string;
  dialCode: string;
  areaCode: string;
  number: string;
}) {
  const areaCode = onlyDigits(input.areaCode);
  const number = onlyDigits(input.number);

  if (!/^[A-Z]{2}$/.test(input.iso)) return false;
  if (!/^\+\d{1,4}$/.test(input.dialCode)) return false;

  if (input.iso === "BR") {
    return /^\d{2}$/.test(areaCode) &&
      /^\d{8,9}$/.test(number);
  }

  return /^\d{1,5}$/.test(areaCode) &&
    /^\d{6,12}$/.test(number);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      fullName?: string;
      cpf?: string;
      birthDate?: string;
      phoneCountryIso?: string;
      phoneCountryCode?: string;
      phoneAreaCode?: string;
      phoneNumber?: string;
      email?: string;
      confirmEmail?: string;
      password?: string;
      confirmPassword?: string;
      locale?: "pt-BR" | "en-US" | "en-GB";
    };

    const fullName = body.fullName?.trim() ?? "";
    const cpf = onlyDigits(body.cpf ?? "");
    const birthDate = body.birthDate ?? "";
    const email = normalizeEmail(body.email ?? "");
    const confirmEmail = normalizeEmail(
      body.confirmEmail ?? "",
    );
    const password = body.password ?? "";
    const confirmPassword = body.confirmPassword ?? "";
    const phoneCountryIso =
      body.phoneCountryIso?.toUpperCase() ?? "BR";
    const phoneCountryCode =
      body.phoneCountryCode?.trim() ?? "+55";
    const phoneAreaCode = onlyDigits(
      body.phoneAreaCode ?? "",
    );
    const phoneNumber = onlyDigits(
      body.phoneNumber ?? "",
    );
    const locale =
      body.locale === "en-US" || body.locale === "en-GB"
        ? body.locale
        : "pt-BR";

    if (!fullName) {
      return NextResponse.json(
        { error: "name_required" },
        { status: 422 },
      );
    }

    if (!email || email !== confirmEmail) {
      return NextResponse.json(
        { error: "email_mismatch" },
        { status: 422 },
      );
    }

    if (
      !password ||
      password !== confirmPassword
    ) {
      return NextResponse.json(
        { error: "password_mismatch" },
        { status: 422 },
      );
    }

    if (!isStrongEnoughPassword(password)) {
      return NextResponse.json(
        { error: "weak_password" },
        { status: 422 },
      );
    }

    if (!isValidCpf(cpf)) {
      return NextResponse.json(
        { error: "invalid_cpf" },
        { status: 422 },
      );
    }

    if (!validBirthDate(birthDate)) {
      return NextResponse.json(
        { error: "invalid_birth_date" },
        { status: 422 },
      );
    }

    if (
      !validPhone({
        iso: phoneCountryIso,
        dialCode: phoneCountryCode,
        areaCode: phoneAreaCode,
        number: phoneNumber,
      })
    ) {
      return NextResponse.json(
        { error: "invalid_phone" },
        { status: 422 },
      );
    }

    const admin = createAdminClient();

    const { data: existingCpf } = await admin
      .from("profiles")
      .select("id")
      .eq("cpf", cpf)
      .maybeSingle();

    if (existingCpf) {
      return NextResponse.json(
        { error: "cpf_already_used" },
        { status: 409 },
      );
    }

    const identity = await verifyIdentityDocument({
      request,
      documentType: "cpf",
      document: cpf,
      birthDate,
    });

    if (!identity.valid) {
      return NextResponse.json(
        { error: "invalid_cpf" },
        { status: 422 },
      );
    }

    if (
      officialVerificationRequired() &&
      !identity.officialVerified
    ) {
      const status =
        identity.status === "rate_limited"
          ? 429
          : 503;

      return NextResponse.json(
        {
          error:
            identity.status === "rate_limited"
              ? "identity_rate_limited"
              : "identity_not_verified",
          identity,
        },
        { status },
      );
    }

    const supabase = await createClient();

    const { data, error } =
      await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            locale,
            cpf,
            date_of_birth: birthDate,
            phone_country_iso: phoneCountryIso,
            phone_country_code: phoneCountryCode,
            phone_area_code: phoneAreaCode,
            phone_number: phoneNumber,
          },
          emailRedirectTo: `${new URL(request.url).origin}/auth/callback?next=${encodeURIComponent(
            locale === "pt-BR"
              ? "/onboarding"
              : `/${locale.toLowerCase()}/onboarding`,
          )}`,
        },
      });

    if (error) {
      return NextResponse.json(
        {
          error: "signup_failed",
          detail: error.message,
        },
        { status: 400 },
      );
    }

    if (data.user && identity.officialVerified) {
      await admin
        .from("profiles")
        .update({
          cpf_verified_at: new Date().toISOString(),
          cpf_verification_provider:
            identity.provider,
        })
        .eq("id", data.user.id);
    }

    return NextResponse.json({
      ok: true,
      session: Boolean(data.session),
      emailConfirmationRequired: !data.session,
      identity: {
        officialVerified:
          identity.officialVerified,
        provider: identity.provider,
        status: identity.status,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "registration_unavailable" },
      { status: 500 },
    );
  }
}
