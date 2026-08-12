import Link from "next/link";
import type { AppLocale, EnglishLocale } from "@/i18n/locales";
import { localePrefix } from "@/i18n/locales";
import styles from "./site-footer.module.css";

type FooterCopy = {
  tagline: string;
  product: string;
  resources: string;
  pricing: string;
  demo: string;
  company: string;
  about: string;
  security: string;
  createAccount: string;
  support: string;
  help: string;
  privacy: string;
  terms: string;
  brand: string;
  rights: string;
  disclaimer: string;
};

function footerCopy(locale: AppLocale): FooterCopy {
  if (locale === "pt-BR") {
    return {
      tagline: "Tecnologia para transformar organização em liberdade.",
      product: "Produto",
      resources: "Recursos",
      pricing: "Preços",
      demo: "Demonstração",
      company: "Empresa",
      about: "Sobre nós",
      security: "Segurança",
      createAccount: "Criar conta",
      support: "Suporte",
      help: "Central de ajuda",
      privacy: "Privacidade e LGPD",
      terms: "Termos de uso",
      brand: "Marca",
      rights: "Todos os direitos reservados.",
      disclaimer: "Organização financeira, sem promessa de retorno ou aconselhamento de investimento.",
    };
  }

  return {
    tagline: "Technology that turns organisation into freedom.",
    product: "Product",
    resources: "Features",
    pricing: "Pricing",
    demo: "Demo",
    company: "Company",
    about: "About",
    security: "Security",
    createAccount: "Create account",
    support: "Support",
    help: "Help centre",
    privacy: "Privacy",
    terms: "Terms of use",
    brand: "Brand",
    rights: "All rights reserved.",
    disclaimer: "Financial organisation without investment advice or promises of return.",
  };
}

export function SiteFooter({ locale = "pt-BR" }: { locale?: AppLocale }) {
  const copy = footerCopy(locale);
  const prefix = locale === "pt-BR" ? "" : localePrefix(locale as EnglishLocale);
  const path = (pt: string, en: string) => `${prefix}${locale === "pt-BR" ? pt : en}`;
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brandBlock}>
            <Link href={prefix || "/"} aria-label="AUREUM">
              <img src="/brand/aureum-logo-motto-hq.png" alt="AUREUM — Amor, Ordo, Progressus" />
            </Link>
            <p>{copy.tagline}</p>
            <span>AMOR • ORDO • PROGRESSUS</span>
          </div>

          <nav className={styles.column} aria-label={copy.product}>
            <strong>{copy.product}</strong>
            <Link href={path("/recursos", "/resources")}>{copy.resources}</Link>
            <Link href={path("/precos", "/pricing")}>{copy.pricing}</Link>
            <Link href={path("/demonstracao", "/demo")}>{copy.demo}</Link>
          </nav>

          <nav className={styles.column} aria-label={copy.company}>
            <strong>{copy.company}</strong>
            <Link href={path("/sobre-nos", "/about")}>{copy.about}</Link>
            <Link href={path("/seguranca", "/security")}>{copy.security}</Link>
            <Link href={path("/cadastrar", "/sign-up")}>{copy.createAccount}</Link>
          </nav>

          <nav className={styles.column} aria-label={copy.support}>
            <strong>{copy.support}</strong>
            <Link href={path("/ajuda", "/help")}>{copy.help}</Link>
            <Link href={path("/privacidade", "/privacy")}>{copy.privacy}</Link>
            <Link href={path("/termos", "/terms")}>{copy.terms}</Link>
          </nav>

          <nav className={styles.column} aria-label={copy.brand}>
            <strong>{copy.brand}</strong>
            <Link href={path("/amor", "/love")}>Amor</Link>
            <Link href={path("/ordo", "/order")}>Ordo</Link>
            <Link href={path("/progressus", "/progress")}>Progressus</Link>
          </nav>
        </div>

        <div className={styles.bottom}>
          <p>© {year} AUREUM. {copy.rights}</p>
          <small>{copy.disclaimer}</small>
        </div>
      </div>
    </footer>
  );
}
