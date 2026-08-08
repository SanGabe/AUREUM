"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { AppLocale } from "@/i18n/locales";
import {
  CALLING_CODES,
  callingCodeByIso,
} from "@/lib/aureum/country-calling-codes";
import styles from "./country-calling-code-picker.module.css";

export function CountryCallingCodePicker({
  locale,
  onChange,
  value,
}: {
  locale: AppLocale;
  onChange: (value: {
    iso: string;
    dialCode: string;
  }) => void;
  value: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selected = callingCodeByIso(value);

  const options = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return CALLING_CODES;

    return CALLING_CODES.filter((option) => {
      const name =
        locale === "pt-BR"
          ? option.namePt
          : option.nameEn;

      return (
        name.toLowerCase().includes(q) ||
        option.iso.toLowerCase().includes(q) ||
        option.dialCode.includes(q)
      );
    });
  }, [locale, search]);

  useEffect(() => {
    function close(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", escape);

    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", escape);
    };
  }, []);

  return (
    <div className={styles.wrap} ref={ref}>
      <button
        aria-expanded={open}
        aria-haspopup="listbox"
        className={styles.trigger}
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <span aria-hidden="true" className={styles.flag}>
          {selected.flag}
        </span>
        <strong>{selected.dialCode}</strong>
        <span aria-hidden="true" className={styles.chevron}>
          ⌄
        </span>
      </button>

      {open ? (
        <div className={styles.popover}>
          <input
            autoFocus
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder={
              locale === "pt-BR"
                ? "Buscar país ou DDI"
                : "Search country or code"
            }
            type="search"
            value={search}
          />

          <div className={styles.options} role="listbox">
            {options.map((option) => {
              const active = option.iso === selected.iso;
              const name =
                locale === "pt-BR"
                  ? option.namePt
                  : option.nameEn;

              return (
                <button
                  aria-selected={active}
                  className={active ? styles.active : ""}
                  key={option.iso}
                  onClick={() => {
                    onChange({
                      iso: option.iso,
                      dialCode: option.dialCode,
                    });
                    setOpen(false);
                    setSearch("");
                  }}
                  role="option"
                  type="button"
                >
                  <span aria-hidden="true">{option.flag}</span>
                  <span>{name}</span>
                  <strong>{option.dialCode}</strong>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
