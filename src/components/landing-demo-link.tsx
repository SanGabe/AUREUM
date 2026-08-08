"use client";

import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./landing-demo-link.module.css";

export function LandingDemoLink({
  children,
  className,
  href,
  loadingText = "Carregando demonstração...",
}: {
  children: ReactNode;
  className?: string;
  href: string;
  loadingText?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const navigationTimer = useRef<number | null>(null);
  const safetyTimer = useRef<number | null>(null);

  useEffect(() => {
    router.prefetch(href);

    return () => {
      if (navigationTimer.current) {
        window.clearTimeout(navigationTimer.current);
      }

      if (safetyTimer.current) {
        window.clearTimeout(safetyTimer.current);
      }
    };
  }, [href, router]);

  function navigate(event: MouseEvent<HTMLAnchorElement>) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();

    if (loading) return;

    setLoading(true);

    /*
     * A small intentional delay makes the transition visible even when
     * /demonstracao is already prefetched and opens almost instantly.
     */
    navigationTimer.current = window.setTimeout(() => {
      router.push(href);
    }, 280);

    // Never leave the user trapped if navigation is interrupted.
    safetyTimer.current = window.setTimeout(() => {
      setLoading(false);
    }, 10000);
  }

  return (
    <>
      <Link
        aria-busy={loading}
        className={className}
        href={href}
        onClick={navigate}
        prefetch
      >
        {children}
      </Link>

      {loading ? (
        <div
          aria-label={loadingText}
          aria-live="polite"
          className={styles.overlay}
          role="status"
        >
          <div className={styles.card}>
            <div className={styles.orbit} aria-hidden="true">
              <span className={styles.ring} />
              <span className={styles.dot} />
              <span className={styles.mark}>A</span>
            </div>

            <div className={styles.copy}>
              <strong>{loadingText}</strong>
              <span>AUREUM</span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
