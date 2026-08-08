"use client";

import { useRouter } from "next/navigation";
import styles from "./dashboard-view.module.css";

export function HouseholdSwitcher({
  currentId,
  households,
}: {
  currentId: string;
  households: { id: string; name: string; roleLabel: string }[];
}) {
  const router = useRouter();

  return (
    <label className={styles.switcher}>
      <span>HOUSEHOLD</span>
      <select
        onChange={(event) => router.push(`/dashboard?household=${event.target.value}`)}
        value={currentId}
      >
        {households.map(h => <option key={h.id} value={h.id}>{h.name} — {h.roleLabel}</option>)}
      </select>
    </label>
  );
}
