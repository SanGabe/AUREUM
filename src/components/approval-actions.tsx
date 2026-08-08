"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { AppLocale } from "@/i18n/locales";
import styles from "./finance-page.module.css";

export function ApprovalActions({
  id,
  locale,
  table,
}: {
  id: string;
  locale: AppLocale;
  table: "household_join_requests" | "financial_submissions";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approved" | "rejected" | null>(null);
  const [error, setError] = useState("");

  async function resolve(status: "approved" | "rejected") {
    setLoading(status);
    setError("");

    try {
      const supabase = createClient();

      const { error: updateError } = await supabase
        .from(table)
        .update({ status })
        .eq("id", id)
        .eq("status", "pending");

      if (updateError) {
        setError(updateError.message);
        return;
      }

      router.refresh();
    } catch {
      setError(
        locale === "pt-BR"
          ? "Não foi possível concluir a aprovação."
          : "We could not complete the approval.",
      );
    } finally {
      setLoading(null);
    }
  }

  return (
    <div>
      <div className={styles.actions}>
        <button
          className={styles.primaryButton}
          disabled={loading !== null}
          onClick={() => resolve("approved")}
          type="button"
        >
          {loading === "approved"
            ? locale === "pt-BR"
              ? "Aprovando..."
              : "Approving..."
            : locale === "pt-BR"
              ? "Aprovar"
              : "Approve"}
        </button>

        <button
          className={styles.dangerButton}
          disabled={loading !== null}
          onClick={() => resolve("rejected")}
          type="button"
        >
          {loading === "rejected"
            ? locale === "pt-BR"
              ? "Rejeitando..."
              : "Rejecting..."
            : locale === "pt-BR"
              ? "Rejeitar"
              : "Reject"}
        </button>
      </div>

      {error ? (
        <div className={styles.error} style={{ marginTop: 8 }}>
          {error}
        </div>
      ) : null}
    </div>
  );
}
