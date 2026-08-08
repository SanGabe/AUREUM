"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import type { AppLocale } from "@/i18n/locales";
import {
  type AureumTheme,
  useAureumTheme,
} from "@/components/theme-provider";
import styles from "./theme-selector.module.css";

function labels(locale: AppLocale) {
  if (locale === "pt-BR") {
    return {
      title: "Aparência",
      dark: "Escuro",
      light: "Claro",
      contrast: "Alto contraste",
    };
  }

  return {
    title: "Appearance",
    dark: "Dark",
    light: "Light",
    contrast: "High contrast",
  };
}

const ICONS: Record<AureumTheme, string> = {
  dark: "◐",
  light: "☀",
  contrast: "◉",
};

function ThemeDropdown({
  compact,
  locale,
  showLabel = true,
}: {
  compact?: boolean;
  locale: AppLocale;
  showLabel?: boolean;
}) {
  const { theme, setTheme } = useAureumTheme();
  const t = labels(locale);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const options: Array<{
    value: AureumTheme;
    label: string;
  }> = [
    { value: "dark", label: t.dark },
    { value: "light", label: t.light },
    { value: "contrast", label: t.contrast },
  ];

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

  const current =
    options.find((option) => option.value === theme) ??
    options[0];

  return (
    <div
      className={
        compact
          ? `${styles.picker} ${styles.compact}`
          : styles.picker
      }
      ref={ref}
    >
      {showLabel ? (
        <span className={styles.label}>{t.title}</span>
      ) : null}

      <button
        aria-controls={id}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={styles.trigger}
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <span className={styles.triggerLabel}>
          <i aria-hidden="true">{ICONS[current.value]}</i>
          {current.label}
        </span>
        <span
          aria-hidden="true"
          className={open ? styles.chevronOpen : styles.chevron}
        >
          ⌄
        </span>
      </button>

      {open ? (
        <div
          aria-label={t.title}
          className={styles.menu}
          id={id}
          role="listbox"
        >
          {options.map((option) => (
            <button
              aria-selected={theme === option.value}
              className={
                theme === option.value ? styles.selected : ""
              }
              key={option.value}
              onClick={() => {
                setTheme(option.value);
                setOpen(false);
              }}
              role="option"
              type="button"
            >
              <i aria-hidden="true">{ICONS[option.value]}</i>
              <span>{option.label}</span>
              {theme === option.value ? (
                <b aria-hidden="true">✓</b>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function ThemeSelect({
  compact = false,
  locale,
}: {
  compact?: boolean;
  locale: AppLocale;
}) {
  return <ThemeDropdown compact={compact} locale={locale} />;
}

export function ThemeHeaderSelect({
  locale,
}: {
  locale: AppLocale;
}) {
  return (
    <ThemeDropdown
      compact
      locale={locale}
      showLabel={false}
    />
  );
}

export function ThemeButtons({
  locale,
}: {
  locale: AppLocale;
}) {
  const { theme, setTheme } = useAureumTheme();
  const t = labels(locale);

  const options: Array<{
    value: AureumTheme;
    icon: string;
    label: string;
  }> = [
    { value: "dark", icon: "◐", label: t.dark },
    { value: "light", icon: "☀", label: t.light },
    {
      value: "contrast",
      icon: "◉",
      label: t.contrast,
    },
  ];

  return (
    <div className={styles.buttons} aria-label={t.title}>
      {options.map((option) => (
        <button
          aria-pressed={theme === option.value}
          className={
            theme === option.value ? styles.active : ""
          }
          key={option.value}
          onClick={() => setTheme(option.value)}
          type="button"
        >
          <span aria-hidden="true">{option.icon}</span>
          {option.label}
        </button>
      ))}
    </div>
  );
}
