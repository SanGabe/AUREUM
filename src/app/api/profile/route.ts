import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  isValidCpf,
  onlyDigits,
} from "@/lib/aureum/identity-validation";
import {
  officialVerificationRequired,
  verifyIdentityDocument,
} from "@/lib/aureum/identity-provider";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function text(value: unknown, max = 160) {
  if (typeof value !== "string") return null;
  const clean = value.trim();
  return clean ? clean.slice(0, max) : null;
}

function validBirthDate(value: string | null) {
  if (!value) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = new Date(`${value}T00:00:00Z`);
  return (
    !Number.isNaN(date.getTime()) &&
    date.getTime() <= Date.now()
  );
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "not_authenticated" },
        { status: 401 },
      );
    }

    const body = (await request.json()) as Record<
      string,
      unknown
    >;

    const fullName = text(body.fullName, 120);
    const cpf = onlyDigits(
      typeof body.cpf === "string" ? body.cpf : "",
    );
    const birthDate = text(body.birthDate, 10);

    if (!fullName) {
      return NextResponse.json(
        { error: "name_required" },
        { status: 422 },
      );
    }

    if (cpf && !isValidCpf(cpf)) {
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

    const admin = createAdminClient();

    const { data: existing } = await admin
      .from("profiles")
      .select(
        "cpf, cpf_verified_at, date_of_birth",
      )
      .eq("id", user.id)
      .maybeSingle();

    let cpfVerifiedAt =
      existing?.cpf_verified_at ?? null;
    let cpfVerificationProvider: string | null =
      null;

    const cpfChanged =
      (existing?.cpf ?? null) !== (cpf || null);

    const shouldVerify =
      Boolean(cpf) &&
      (cpfChanged || !cpfVerifiedAt);

    if (shouldVerify) {
      if (!birthDate) {
        return NextResponse.json(
          { error: "birth_date_required_for_cpf" },
          { status: 422 },
        );
      }

      const verification =
        await verifyIdentityDocument({
          request,
          documentType: "cpf",
          document: cpf,
          birthDate,
        });

      if (!verification.valid) {
        return NextResponse.json(
          { error: "invalid_cpf" },
          { status: 422 },
        );
      }

      if (
        officialVerificationRequired() &&
        !verification.officialVerified
      ) {
        return NextResponse.json(
          {
            error:
              verification.status === "rate_limited"
                ? "identity_rate_limited"
                : "identity_not_verified",
          },
          {
            status:
              verification.status === "rate_limited"
                ? 429
                : 503,
          },
        );
      }

      cpfVerifiedAt =
        verification.officialVerified
          ? new Date().toISOString()
          : null;

      cpfVerificationProvider =
        verification.officialVerified
          ? verification.provider
          : null;
    } else if (!cpf) {
      cpfVerifiedAt = null;
      cpfVerificationProvider = null;
    }

    const phoneCountryIso = text(
      body.phoneCountryIso,
      2,
    )?.toUpperCase() ?? null;

    const phoneCountryCode = text(
      body.phoneCountryCode,
      6,
    );

    const phoneAreaCode = onlyDigits(
      typeof body.phoneAreaCode === "string"
        ? body.phoneAreaCode
        : "",
    ).slice(0, 5) || null;

    const phoneNumber = onlyDigits(
      typeof body.phoneNumber === "string"
        ? body.phoneNumber
        : "",
    ).slice(0, 12) || null;

    const update = {
      full_name: fullName,
      avatar_path: text(body.avatarPath, 500),
      date_of_birth: birthDate,
      cpf: cpf || null,
      cpf_verified_at: cpfVerifiedAt,
      cpf_verification_provider:
        cpfVerificationProvider,
      phone_country_iso: phoneCountryIso,
      phone_country_code: phoneCountryCode,
      phone_area_code: phoneAreaCode,
      phone_number: phoneNumber,

      address_country_code:
        text(body.addressCountryCode, 2)
          ?.toUpperCase() ?? null,
      address_postal_code: text(
        body.addressPostalCode,
        24,
      ),
      address_state: text(body.addressState, 100),
      address_city: text(body.addressCity, 120),
      address_district: text(
        body.addressDistrict,
        120,
      ),
      address_street: text(
        body.addressStreet,
        180,
      ),
      address_number: text(
        body.addressNumber,
        40,
      ),
      address_complement: text(
        body.addressComplement,
        160,
      ),
    };

    const { error } = await admin
      .from("profiles")
      .update(update)
      .eq("id", user.id);

    if (error) {
      if (
        error.message
          .toLowerCase()
          .includes("profiles_cpf_unique")
      ) {
        return NextResponse.json(
          { error: "cpf_already_used" },
          { status: 409 },
        );
      }

      return NextResponse.json(
        {
          error: "profile_update_failed",
          detail: error.message,
        },
        { status: 400 },
      );
    }

    await supabase.auth.updateUser({
      data: {
        full_name: fullName,
        avatar_path: update.avatar_path,
      },
    });

    return NextResponse.json({
      ok: true,
      cpfVerified: Boolean(cpfVerifiedAt),
    });
  } catch {
    return NextResponse.json(
      { error: "profile_unavailable" },
      { status: 500 },
    );
  }
}
