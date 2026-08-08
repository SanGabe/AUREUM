import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import styles from "@/components/auth.module.css";

export const metadata = { title: "Entrar | AUREUM" };

type Props = { searchParams: Promise<{ next?: string; erro?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const redirectTo = params.next?.startsWith("/") && !params.next.startsWith("//") ? params.next : "/dashboard";
  const initialError = params.erro === "confirmacao" ? "Não foi possível confirmar seu e-mail. Tente novamente." : undefined;

  return (
    <main className={styles.shell}>
      <section className={styles.brandPanel}>
        <Link href="/" className={styles.brandLogo}>
          <img src="/brand/aureum-logo-motto-hq.png" alt="AUREUM" />
        </Link>
        <div className={styles.brandCopy}>
          <p className={styles.eyebrow}>SEU ESPAÇO FINANCEIRO</p>
          <h2>Clareza começa quando tudo volta para o mesmo lugar.</h2>
          <p>Entre para acessar seus Núcleos, movimentações, metas e permissões.</p>
        </div>
        <img className={styles.authBird} src="/brand/aureum-footer-bird.svg" alt="" aria-hidden="true" />
      </section>

      <section className={styles.formPanel}>
        <div className={styles.card}>
          <header className={styles.header}>
            <p className={styles.eyebrow}>ENTRAR</p>
            <h1>Bem-vindo de volta.</h1>
            <p>Acesse seus dados financeiros com sua conta AUREUM.</p>
          </header>
          <AuthForm initialError={initialError} mode="signin" redirectTo={redirectTo} />
          <p className={styles.footer}>Ainda não tem conta? <Link href="/cadastrar">Criar conta</Link></p>
        </div>
      </section>
    </main>
  );
}
