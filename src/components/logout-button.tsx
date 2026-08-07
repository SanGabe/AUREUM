"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/entrar");
    router.refresh();
  }

  return (
    <button
      className="sidebar-link"
      disabled={loading}
      onClick={handleLogout}
      style={{
        background: "transparent",
        border: 0,
        cursor: loading ? "wait" : "pointer",
        font: "inherit",
        textAlign: "left",
        width: "100%",
      }}
      type="button"
    >
      <span>↪</span> {loading ? "Saindo..." : "Sair"}
    </button>
  );
}
