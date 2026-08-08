"use client";

import Link from "next/link";
import { useState } from "react";
import type { AppLocale, EnglishLocale } from "@/i18n/locales";
import { localePrefix } from "@/i18n/locales";
import type { LanguageRoute } from "@/components/language-menu";
import { ThemeButtons } from "@/components/theme-selector";
import styles from "./marketing-mobile-menu.module.css";

function routeMap(route: LanguageRoute, locale: AppLocale) {
  const pt: Record<LanguageRoute, string> = {
    home: "/",
    resources: "/recursos",
    "for-whom": "/para-quem",
    security: "/seguranca",
    about: "/sobre-nos",
    love: "/amor",
    order: "/ordo",
    progress: "/progressus",
    demo: "/demonstracao",
  };

  const en: Record<LanguageRoute, string> = {
    home: "",
    resources: "/resources",
    "for-whom": "/for-whom",
    security: "/security",
    about: "/about",
    love: "/love",
    order: "/order",
    progress: "/progress",
    demo: "/demo",
  };

  if (locale === "pt-BR") return pt[route];
  return `${localePrefix(locale as EnglishLocale)}${en[route]}`;
}

export function MarketingMobileMenu({
  currentLocale,
  route = "home",
}: {
  currentLocale: AppLocale;
  route?: LanguageRoute;
}) {
  const [open, setOpen] = useState(false);
  const pt = currentLocale === "pt-BR";
  const prefix =
    currentLocale === "pt-BR"
      ? ""
      : localePrefix(currentLocale as EnglishLocale);

  const links = pt
    ? [
        ["/recursos", "Recursos"],
        ["/para-quem", "Para quem"],
        ["/seguranca", "Segurança"],
        ["/sobre-nos", "Sobre nós"],
        ["/demonstracao", "Demonstração"],
      ]
    : [
        [`${prefix}/resources`, "Features"],
        [`${prefix}/for-whom`, "Who it is for"],
        [`${prefix}/security`, "Security"],
        [`${prefix}/about`, "About"],
        [`${prefix}/demo`, "Demo"],
      ];

  return (
    <div className={styles.wrap}>
      <button
        aria-expanded={open}
        aria-label={pt ? "Abrir menu" : "Open menu"}
        className={styles.trigger}
        onClick={() => setOpen(true)}
        type="button"
      >
        ☰
      </button>

      {open ? (
        <div
          className={styles.overlay}
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <aside
            className={styles.drawer}
            onClick={(event) => event.stopPropagation()}
          >
            <header>
              <img src="/brand/aureum-logo-hq.png" alt="AUREUM" />
              <button
                aria-label={pt ? "Fechar menu" : "Close menu"}
                onClick={() => setOpen(false)}
                type="button"
              >
                ×
              </button>
            </header>

            <nav>
              {links.map(([href, label]) => (
                <Link
                  href={href}
                  key={href}
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </nav>

            <div className={styles.actions}>
              <Link
                className={styles.primary}
                href={pt ? "/cadastrar" : `${prefix}/sign-up`}
                onClick={() => setOpen(false)}
              >
                {pt ? "Criar minha conta" : "Create account"}
              </Link>
              <Link
                className={styles.secondary}
                href={pt ? "/entrar" : `${prefix}/sign-in`}
                onClick={() => setOpen(false)}
              >
                {pt ? "Entrar" : "Sign in"}
              </Link>
            </div>

            <div className={styles.divider} />

            <div className={styles.language}>
              <span>{pt ? "Idioma" : "Language"}</span>
              <div>
                <Link
                  className={
                    currentLocale === "pt-BR" ? styles.active : ""
                  }
                  href={routeMap(route, "pt-BR")}
                >
                  PT-BR
                </Link>
                <Link
                  className={
                    currentLocale === "en-US" ? styles.active : ""
                  }
                  href={routeMap(route, "en-US")}
                >
                  EN-US
                </Link>
                <Link
                  className={
                    currentLocale === "en-GB" ? styles.active : ""
                  }
                  href={routeMap(route, "en-GB")}
                >
                  EN-GB
                </Link>
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.appearance}>
              <span>{pt ? "Aparência" : "Appearance"}</span>
              <ThemeButtons locale={currentLocale} />
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
