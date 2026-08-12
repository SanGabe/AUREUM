import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import styles from "@/components/auth.module.css";

export const metadata = {
  title: "Criar conta | AUREUM",
};

export default function SignUpPage() {
  return (
    <main className={`${styles.shell} ${styles.signupShell}`}>
      <section className={styles.brandPanel}>
        <Link href="/" className={styles.brandLogo}>
          <img
            src="/brand/aureum-logo-motto-hq.png"
            alt="AUREUM"
          />
        </Link>

        <div className={styles.brandCopy}>
          <p className={styles.eyebrow}>
            AMOR • ORDO • PROGRESSUS
          </p>
          <h2>
            Organize o presente para dar direção ao
            futuro.
          </h2>
          <p>
            Crie sua conta. Na etapa seguinte você
            escolhe entre criar seu próprio Núcleo ou
            entrar em um que já existe.
          </p>
        </div>

        <img
          className={styles.authBird}
          src="/brand/aureum-footer-bird.svg"
          alt=""
          aria-hidden="true"
        />
      </section>

      <section className={styles.formPanel}>
        <div
          className={`${styles.card} ${styles.signupCard}`}
        >
          <header className={styles.header}>
            <p className={styles.eyebrow}>
              CRIAR CONTA
            </p>
            <h1>Bem-vindo ao AUREUM.</h1>
            <p>
              Comece pela sua identidade e contato.
              Sua estrutura financeira vem logo
              depois.
            </p>
          </header>

          <AuthForm mode="signup" />

          <p className={styles.footer}>
            Já tem uma conta?{" "}
            <Link href="/entrar">Entrar</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
