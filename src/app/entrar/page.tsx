import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import styles from "@/components/auth.module.css";

export const metadata = {
  title: "Entrar | AUREUM",
};

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
    erro?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const redirectTo =
    params.next?.startsWith("/") && !params.next.startsWith("//")
      ? params.next
      : "/dashboard";
  const initialError =
    params.erro === "confirmacao"
      ? "Não foi possível confirmar seu e-mail. Tente novamente."
      : undefined;

  return (
    <main className={styles.shell}>
      <section className={styles.card}>
        <Link className={styles.brand} href="/">
          <img className={styles.authLogo} src="/brand/aureum-monogram.png" alt="AUREUM" />
        </Link>

        <header className={styles.header}>
          <h1>Bem-vindo de volta.</h1>
          <p>Entre para acessar seu espaço financeiro.</p>
        </header>

        <AuthForm
          initialError={initialError}
          mode="signin"
          redirectTo={redirectTo}
        />

        <p className={styles.footer}>
          Ainda não tem conta? <Link href="/cadastrar">Criar conta</Link>
        </p>
      </section>
    </main>
  );
}
