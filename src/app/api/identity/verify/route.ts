import { NextResponse } from "next/server";
import {
  officialVerificationRequired,
  verifyIdentityDocument,
  type IdentityDocumentType,
} from "@/lib/aureum/identity-provider";
import {
  normalizeCnpj,
  onlyDigits,
} from "@/lib/aureum/identity-validation";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      documentType?: IdentityDocumentType;
      document?: string;
      birthDate?: string;
    };

    const documentType =
      body.documentType === "cnpj" ? "cnpj" : "cpf";

    const document =
      documentType === "cpf"
        ? onlyDigits(body.document ?? "")
        : normalizeCnpj(body.document ?? "");

    const result = await verifyIdentityDocument({
      request,
      documentType,
      document,
      birthDate: body.birthDate,
    });

    const required = officialVerificationRequired();

    return NextResponse.json(
      {
        ...result,
        required,
      },
      {
        status:
          result.status === "rate_limited"
            ? 429
            : result.valid
              ? 200
              : 422,
      },
    );
  } catch {
    return NextResponse.json(
      {
        valid: false,
        officialVerified: false,
        provider: "local",
        status: "provider_unavailable",
        required: officialVerificationRequired(),
      },
      { status: 500 },
    );
  }
}
