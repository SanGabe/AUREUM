import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import styles from "@/components/auth.module.css";

export const metadata = {
  title: "Criar conta | AUREUM",
};

export default function SignUpPage() {
  return (
    <main className={styles.shell}>
      <section className={styles.card}>
        <Link className={styles.brand} href="/">
          <img className={styles.authLogo} src="/brand/aureum-monogram.png" alt="AUREUM" />
        </Link>

        <header className={styles.header}>
          <h1>Crie seu espaço financeiro.</h1>
          <p>Começamos pela sua conta. O espaço do casal entra na próxima etapa.</p>
        </header>

        <AuthForm mode="signup" />

        <p className={styles.footer}>
          Já tem uma conta? <Link href="/entrar">Entrar</Link>
        </p>
      </section>
    </main>
  );
}
