"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useDashboardActionLoading } from "@/components/dashboard-action-loading";
import styles from "./dashboard-view.module.css";

export type NucleusOption = {
  id: string;
  name: string;
  roleLabel: string;
};

function parseMonth(value: string) {
  const [year, month] = value.split("-").map(Number);
  return { year, month };
}

function toMonthValue(year: number, month: number) {
  const date = new Date(Date.UTC(year, month - 1, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function monthName(month: number) {
  return new Intl.DateTimeFormat("pt-BR", {
    month: "short",
    timeZone: "UTC",
  })
    .format(new Date(Date.UTC(2026, month - 1, 1)))
    .replace(".", "")
    .toUpperCase();
}

function fullMonthLabel(value: string) {
  const { year, month } = parseMonth(value);
  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })
    .format(new Date(Date.UTC(year, month - 1, 1)))
    .toUpperCase();
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length > 1) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return parts[0]?.slice(0, 2).toUpperCase() || "U";
}

export function MonthNavigator({
  currentNucleusId,
  selectedMonth,
}: {
  currentNucleusId: string;
  selectedMonth: string;
}) {
  const router = useRouter();
  const { startLoading } = useDashboardActionLoading();
  const pickerRef = useRef<HTMLDivElement>(null);
  const parsed = parseMonth(selectedMonth);
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(parsed.year);

  useEffect(() => {
    setViewYear(parsed.year);
  }, [parsed.year]);

  useEffect(() => {
    function close(event: MouseEvent) {
      if (!pickerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  function goToMonth(value: string) {
    if (value === selectedMonth) {
      setOpen(false);
      return;
    }

    startLoading("Carregando período...");
    router.push(
      `/dashboard?household=${encodeURIComponent(currentNucleusId)}&month=${encodeURIComponent(value)}`,
    );
    setOpen(false);
  }

  function move(offset: number) {
    const date = new Date(Date.UTC(parsed.year, parsed.month - 1 + offset, 1));
    goToMonth(
      `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`,
    );
  }

  const today = new Date();
  const currentValue = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

  return (
    <div className={styles.monthNavigator} ref={pickerRef}>
      <span className={styles.periodLabel}>PERÍODO</span>

      <div className={styles.monthControl}>
        <button
          aria-label="Mês anterior"
          className={styles.monthArrow}
          onClick={() => move(-1)}
          type="button"
        >
          ‹
        </button>

        <button
          aria-expanded={open}
          className={styles.monthMain}
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          <span className={styles.calendarIcon}>▦</span>
          <strong>{fullMonthLabel(selectedMonth)}</strong>
          <span className={styles.chevron}>{open ? "⌃" : "⌄"}</span>
        </button>

        <button
          aria-label="Próximo mês"
          className={styles.monthArrow}
          onClick={() => move(1)}
          type="button"
        >
          ›
        </button>
      </div>

      {open ? (
        <div className={styles.monthPopover}>
          <div className={styles.monthPopoverHeader}>
            <button onClick={() => setViewYear((year) => year - 1)} type="button">
              ‹
            </button>
            <strong>{viewYear}</strong>
            <button onClick={() => setViewYear((year) => year + 1)} type="button">
              ›
            </button>
          </div>

          <div className={styles.monthGrid}>
            {Array.from({ length: 12 }, (_, index) => {
              const month = index + 1;
              const value = toMonthValue(viewYear, month);
              const active = value === selectedMonth;

              return (
                <button
                  className={active ? styles.monthActive : ""}
                  key={value}
                  onClick={() => goToMonth(value)}
                  type="button"
                >
                  {monthName(month)}
                </button>
              );
            })}
          </div>

          <button
            className={styles.todayButton}
            onClick={() => goToMonth(currentValue)}
            type="button"
          >
            Ir para o mês atual
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function ProfileMenu({
  currentNucleusId,
  nuclei,
  selectedMonth,
  userEmail,
  userName,
  userSubtitle,
}: {
  currentNucleusId: string;
  nuclei: NucleusOption[];
  selectedMonth: string;
  userEmail?: string;
  userName: string;
  userSubtitle: string;
}) {
  const router = useRouter();
  const { startLoading, stopLoading } = useDashboardActionLoading();
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const current = useMemo(
    () => nuclei.find((nucleus) => nucleus.id === currentNucleusId),
    [currentNucleusId, nuclei],
  );

  useEffect(() => {
    function close(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  function changeNucleus(id: string) {
    if (id === currentNucleusId) return;

    startLoading("Trocando de Núcleo...");
    router.push(
      `/dashboard?household=${encodeURIComponent(id)}&month=${encodeURIComponent(selectedMonth)}`,
    );
    setOpen(false);
  }

  async function logout() {
    setLoggingOut(true);
    startLoading("Saindo do AUREUM...");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        stopLoading();
        setLoggingOut(false);
        return;
      }

      router.replace("/entrar");
      router.refresh();
    } catch {
      stopLoading();
      setLoggingOut(false);
    }
  }

  const returnParams = new URLSearchParams({
    household: currentNucleusId,
    month: selectedMonth,
  }).toString();

  return (
    <div className={styles.profileWrap} ref={menuRef}>
      {open ? (
        <div className={styles.profileMenu}>
          <div className={styles.profileMenuIdentity}>
            <span>{initials(userName)}</span>
            <div>
              <strong>{userName}</strong>
              <small>{userEmail || "Conta AUREUM"}</small>
            </div>
          </div>

          <div className={styles.profileDivider} />

          <label className={styles.profileNucleus}>
            <span>NÚCLEO ATUAL</span>
            <select
              onChange={(event) => changeNucleus(event.target.value)}
              value={currentNucleusId}
            >
              {nuclei.map((nucleus) => (
                <option key={nucleus.id} value={nucleus.id}>
                  {nucleus.name} — {nucleus.roleLabel}
                </option>
              ))}
            </select>
          </label>

          <div className={styles.profileDivider} />

          <nav className={styles.profileLinks}>
            <Link
              href={`/perfil?${returnParams}`}
              onClick={() => {
                startLoading("Abrindo informações pessoais...");
                setOpen(false);
              }}
            >
              <span>♙</span>
              <div>
                <strong>Informações pessoais</strong>
                <small>Nome, e-mail e dados da conta</small>
              </div>
            </Link>

            <Link
              href={`/configuracoes?${returnParams}`}
              onClick={() => {
                startLoading("Abrindo configurações...");
                setOpen(false);
              }}
            >
              <span>⚙</span>
              <div>
                <strong>Configurações</strong>
                <small>Idioma, moeda e preferências</small>
              </div>
            </Link>
          </nav>

          <div className={styles.profileDivider} />

          <button
            className={styles.profileLogout}
            disabled={loggingOut}
            onClick={logout}
            type="button"
          >
            <span>↪</span>
            {loggingOut ? "Saindo..." : "Sair do AUREUM"}
          </button>
        </div>
      ) : null}

      <button
        aria-expanded={open}
        className={styles.profileButton}
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <span className={styles.profileAvatar}>{initials(userName)}</span>
        <span className={styles.profileButtonCopy}>
          <strong>{userName.split(/\s+/)[0] || userName}</strong>
          <small>
            {current?.name
              ? `${current.name} • ${current.roleLabel}`
              : userSubtitle}
          </small>
        </span>
        <span className={styles.profileChevron}>{open ? "⌃" : "⌄"}</span>
      </button>
    </div>
  );
}
