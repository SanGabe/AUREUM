import Link from "next/link";
import { LandingDemoLink } from "@/components/landing-demo-link";
import { LanguageMenu } from "@/components/language-menu";
import type { EnglishLocale } from "@/i18n/locales";
import { localePrefix } from "@/i18n/locales";
import { getEnglishCopy } from "@/i18n/english-copy";
import { SiteFooter } from "@/components/site-footer";
import styles from "@/app/landing.module.css";

function IconShield() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3 19 6v5c0 4.6-2.8 8-7 10-4.2-2-7-5.4-7-10V6l7-3Z" />
      <path d="m9 12 2 2 4-5" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function IconCloud() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 18H6a4 4 0 0 1-.5-8A6 6 0 0 1 17 8.5a4.5 4.5 0 0 1 .5 9H16" />
      <path d="M12 12v9m0-9-3 3m3-3 3 3" />
    </svg>
  );
}

function HeroDevices({ locale }: { locale: EnglishLocale }) {
  const currency = locale === "en-GB" ? "£" : "$";

  return (
    <div className={styles.devicesWrap} aria-label="AUREUM dashboard preview">
      <div className={styles.heroBirdHalo} aria-hidden="true">
        <img src="/brand/aureum-emblem-hq.png" alt="" />
      </div>

      <div className={styles.phone}>
        <div className={styles.phoneNotch} />
        <div className={styles.phoneContent}>
          <div className={styles.phoneBrand}><span>AUREUM</span><b>☰</b></div>
          <h3>Overview</h3>
          <div className={styles.balanceCard}>
            <span>Total balance</span>
            <strong>{currency} 24,680.50</strong>
            <small>+12.5% vs previous month</small>
          </div>
          <div className={styles.miniAccount}><i className={styles.goldDot} /><span>Accounts</span><strong>{currency} 14,150.00</strong></div>
          <div className={styles.miniAccount}><i className={styles.redDot} /><span>Cards</span><strong>{currency} 2,250.00</strong></div>
          <div className={styles.miniAccount}><i className={styles.greenDot} /><span>Investments</span><strong>{currency} 12,580.50</strong></div>
          <div className={styles.categoryCard}>
            <div className={styles.donut} />
            <div>
              <span>Spending by category</span>
              <small>Groceries&nbsp;&nbsp;32%</small>
              <small>Housing&nbsp;&nbsp;24%</small>
              <small>Leisure&nbsp;&nbsp;15%</small>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.laptop}>
        <div className={styles.laptopScreen}>
          <div className={styles.screenBrand}>AUREUM</div>
          <div className={styles.screenHeader}>Cash flow</div>
          <div className={styles.screenLayout}>
            <div className={styles.cashChart}>
              <svg viewBox="0 0 320 175" role="img" aria-label="Cash-flow chart">
                <g className={styles.gridLines}>
                  <path d="M22 25H310M22 62H310M22 99H310M22 136H310" />
                  <path d="M63 16V148M108 16V148M153 16V148M198 16V148M243 16V148M288 16V148" />
                </g>
                <path className={styles.chartGlow} d="M25 128 55 106 82 112 112 80 141 69 170 91 197 111 225 89 255 55 282 72 307 50" />
                <path className={styles.chartLine} d="M25 128 55 106 82 112 112 80 141 69 170 91 197 111 225 89 255 55 282 72 307 50" />
              </svg>
              <div className={styles.chartMonths}>
                <span>Jan</span><span>Feb</span><span>Mar</span>
                <span>Apr</span><span>May</span><span>Jun</span>
              </div>
            </div>

            <div className={styles.screenMetrics}>
              <div><span>Income</span><strong className={styles.income}>{currency} 18,950.00</strong></div>
              <div><span>Expenses</span><strong className={styles.expense}>{currency} 13,420.00</strong></div>
              <div className={styles.goalsCard}>
                <span>Goals</span>
                <p><b>Family trip</b><em>75%</em></p><i><u style={{ width: "75%" }} /></i>
                <p><b>Emergency fund</b><em>60%</em></p><i><u style={{ width: "60%" }} /></i>
                <p><b>New home</b><em>30%</em></p><i><u style={{ width: "30%" }} /></i>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.laptopBase}><span /></div>
      </div>
    </div>
  );
}

export function EnglishLanding({ locale }: { locale: EnglishLocale }) {
  const t = getEnglishCopy(locale);
  const prefix = localePrefix(locale);

  return (
    <main className={styles.page} lang={locale}>
      <header className={styles.header}>
        <Link className={styles.headerLogo} href={prefix} aria-label="AUREUM">
          <img src="/brand/aureum-logo-hq.png" alt="AUREUM" />
        </Link>

        <nav className={styles.nav} aria-label="Main navigation">
          <Link href={`${prefix}/resources`}>Features</Link>
          <Link href={`${prefix}/for-whom`}>Who it is for</Link>
          <Link href={`${prefix}/security`}>Security</Link>
          <Link href={`${prefix}/about`}>About</Link>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
            <LandingDemoLink
              href={`${prefix}/demo`}
              loadingText="Loading demo..."
            >
              Demo
            </LandingDemoLink>
            <LanguageMenu currentLocale={locale} route="home" />
          </span>
        </nav>

        <div className={styles.headerActions}>
          <Link className={styles.headerPrimary} href={`${prefix}/sign-up`}>
            Create my account
          </Link>
          <Link className={styles.headerSecondary} href={`${prefix}/sign-in`}>
            Sign in
          </Link>
        </div>
      </header>


      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>{t.landing.heroEyebrow}</p>
          <h1>{t.landing.heroTitle}</h1>
          <p className={styles.heroText}>{t.landing.heroText}</p>

          <div className={styles.heroActions}>
            <Link className={styles.primaryButton} href={`${prefix}/sign-up`}>
              {t.common.createAccount} <span>→</span>
            </Link>
            <LandingDemoLink
              className={styles.secondaryButton}
              href={`${prefix}/demo`}
              loadingText="Loading demo..."
            >
              <span className={styles.playButton}>▶</span>
              {t.landing.seeDemo}
            </LandingDemoLink>
          </div>

          <div className={styles.trustRow}>
            <div><span className={styles.trustIcon}><IconShield /></span><p>{t.landing.trust1.split("\n").map((x,i)=><span key={x}>{x}{i===0?<br/>:null}</span>)}</p></div>
            <div><span className={styles.trustIcon}><IconLock /></span><p>{t.landing.trust2.split("\n").map((x,i)=><span key={x}>{x}{i===0?<br/>:null}</span>)}</p></div>
            <div><span className={styles.trustIcon}><IconCloud /></span><p>{t.landing.trust3.split("\n").map((x,i)=><span key={x}>{x}{i===0?<br/>:null}</span>)}</p></div>
          </div>
        </div>

        <HeroDevices locale={locale} />
      </section>

      <section className={styles.problemCard}>
        <div className={styles.stoneArea}>
          <img src="/brand/aureum-stone-hq.png" alt="Stone representing outdated financial organisation" />
        </div>
        <div className={styles.problemContent}>
          <p className={styles.sectionKicker}>{t.landing.problemKicker}</p>
          <h2>{t.landing.problemTitle}</h2>
          <p className={styles.bodyText}>{t.landing.problemText}</p>
          <div className={styles.problemGrid}>
            {t.landing.problems.map((item) => (
              <div className={styles.problemItem} key={item}><span>×</span><p>{item}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.solution}>
        <p className={styles.solutionTitle}>{t.landing.solutionTitle}</p>
        <div className={styles.pillars}>
          {t.landing.pillars.map((pillar) => (
            <Link className={styles.pillarCard} href={`${prefix}/${pillar.slug}`} key={pillar.title}>
              <div className={styles.pillarAsset}><img src={pillar.asset} alt="" aria-hidden="true" /></div>
              <div className={styles.pillarCopy}>
                <h3>{pillar.title}</h3><strong>{pillar.subtitle}</strong><p>{pillar.text}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.story}>
        <div className={styles.sealArea}>
          <img src="/brand/aureum-seal.png" alt="AUREUM institutional seal" />
        </div>
        <div className={styles.storyCopy}>
          <p className={styles.sectionKicker}>{t.landing.storyKicker}</p>
          <h2>{t.landing.storyTitle}</h2>
          <p className={styles.bodyText}>{t.landing.storyText}</p>
        </div>
      </section>

      <section className={styles.finalCta}>
        <div className={styles.finalEmblem}><img src="/brand/aureum-emblem-hq.png" alt="" aria-hidden="true" /></div>
        <div className={styles.finalText}><h2>{t.landing.finalTitle}</h2><p>{t.landing.finalText}</p></div>
        <Link className={styles.primaryButton} href={`${prefix}/sign-up`}>{t.common.createAccount} <span>→</span></Link>
      </section>

      <SiteFooter locale={locale} />
    </main>
  );
}
