"use client";

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

export function ThemeSelect({
  compact = false,
  locale,
}: {
  compact?: boolean;
  locale: AppLocale;
}) {
  const { theme, setTheme } = useAureumTheme();
  const t = labels(locale);

  return (
    <label className={compact ? styles.compact : styles.field}>
      <span>{t.title}</span>
      <select
        aria-label={t.title}
        onChange={(event) => setTheme(event.target.value as AureumTheme)}
        value={theme}
      >
        <option value="dark">◐ {t.dark}</option>
        <option value="light">☀ {t.light}</option>
        <option value="contrast">◑ {t.contrast}</option>
      </select>
    </label>
  );
}


export function ThemeHeaderSelect({
  locale,
}: {
  locale: AppLocale;
}) {
  const { theme, setTheme } = useAureumTheme();
  const t = labels(locale);

  return (
    <select
      aria-label={t.title}
      className={styles.headerSelect}
      onChange={(event) =>
        setTheme(event.target.value as AureumTheme)
      }
      title={t.title}
      value={theme}
    >
      <option value="dark">◐ {t.dark}</option>
      <option value="light">☀ {t.light}</option>
      <option value="contrast">◑ {t.contrast}</option>
    </select>
  );
}

export function ThemeButtons({ locale }: { locale: AppLocale }) {
  const { theme, setTheme } = useAureumTheme();
  const t = labels(locale);

  const options: Array<{
    value: AureumTheme;
    icon: string;
    label: string;
  }> = [
    { value: "dark", icon: "◐", label: t.dark },
    { value: "light", icon: "☀", label: t.light },
    { value: "contrast", icon: "◑", label: t.contrast },
  ];

  return (
    <div className={styles.buttons} aria-label={t.title}>
      {options.map((option) => (
        <button
          aria-pressed={theme === option.value}
          className={theme === option.value ? styles.active : ""}
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
