"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./language-menu.module.css";

export type LanguageRoute =
  | "home"
  | "resources"
  | "for-whom"
  | "security"
  | "about"
  | "love"
  | "order"
  | "progress"
  | "demo";

type CurrentLocale = "pt-BR" | "en-US" | "en-GB";

const ROUTES: Record<
  LanguageRoute,
  { pt: string; en: string }
> = {
  home: { pt: "", en: "" },
  resources: { pt: "/recursos", en: "/resources" },
  "for-whom": { pt: "/para-quem", en: "/for-whom" },
  security: { pt: "/seguranca", en: "/security" },
  about: { pt: "/sobre-nos", en: "/about" },
  love: { pt: "/amor", en: "/love" },
  order: { pt: "/ordo", en: "/order" },
  progress: { pt: "/progressus", en: "/progress" },
  demo: { pt: "/demonstracao", en: "/demo" },
};

function localeHref(
  locale: CurrentLocale,
  route: LanguageRoute,
) {
  const mapped = ROUTES[route];

  if (locale === "pt-BR") {
    return mapped.pt || "/";
  }

  const prefix = locale === "en-GB" ? "/en-gb" : "/en-us";
  return `${prefix}${mapped.en}`;
}

export function LanguageMenu({
  currentLocale,
  route = "home",
}: {
  currentLocale: CurrentLocale;
  route?: LanguageRoute;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    function close(event: MouseEvent) {
      if (!wrapRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const currentLabel =
    currentLocale === "pt-BR"
      ? "PT-BR"
      : currentLocale === "en-GB"
        ? "EN-GB"
        : "EN-US";

  return (
    <span className={styles.wrap} ref={wrapRef}>
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Selecionar idioma"
        className={styles.trigger}
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="8.5" />
          <path d="M3.7 12h16.6M12 3.5c2.2 2.3 3.3 5.1 3.3 8.5S14.2 18.2 12 20.5M12 3.5C9.8 5.8 8.7 8.6 8.7 12s1.1 6.2 3.3 8.5" />
        </svg>

        <span>{currentLabel}</span>
        <b aria-hidden="true">{open ? "⌃" : "⌄"}</b>
      </button>

      {open ? (
        <span className={styles.menu} role="menu">
          <Link
            className={currentLocale === "pt-BR" ? styles.active : ""}
            href={localeHref("pt-BR", route)}
            onClick={() => setOpen(false)}
            role="menuitem"
          >
            <span>PT</span>
            <div>
              <strong>Português</strong>
              <small>Brasil</small>
            </div>
          </Link>

          <Link
            className={currentLocale === "en-US" ? styles.active : ""}
            href={localeHref("en-US", route)}
            onClick={() => setOpen(false)}
            role="menuitem"
          >
            <span>US</span>
            <div>
              <strong>English</strong>
              <small>United States</small>
            </div>
          </Link>

          <Link
            className={currentLocale === "en-GB" ? styles.active : ""}
            href={localeHref("en-GB", route)}
            onClick={() => setOpen(false)}
            role="menuitem"
          >
            <span>GB</span>
            <div>
              <strong>English</strong>
              <small>United Kingdom</small>
            </div>
          </Link>
        </span>
      ) : null}
    </span>
  );
}
