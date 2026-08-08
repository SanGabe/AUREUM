"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import styles from "./dashboard-view.module.css";

type LoadingContextValue = {
  startLoading: (message?: string) => void;
  stopLoading: () => void;
};

const LoadingContext = createContext<LoadingContextValue | null>(null);

export function DashboardActionLoadingProvider({
  children,
  locale = "pt-BR",
}: {
  children: ReactNode;
  locale?: "pt-BR" | "en-US" | "en-GB";
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialRouteRef = useRef("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(
    locale === "pt-BR" ? "Carregando..." : "Loading...",
  );

  const routeKey = `${pathname}?${searchParams.toString()}`;

  const stopLoading = useCallback(() => {
    setLoading(false);
  }, []);

  const startLoading = useCallback(
    (nextMessage?: string) => {
      initialRouteRef.current = routeKey;
      setMessage(
        nextMessage ??
          (locale === "pt-BR" ? "Carregando..." : "Loading..."),
      );
      setLoading(true);
    },
    [locale, routeKey],
  );

  // The old implementation started the overlay before router.push(), but the
  // provider survived a same-route search-param navigation. That left loading
  //=true forever. As soon as pathname/search params change, the action ended.
  useEffect(() => {
    if (
      loading &&
      initialRouteRef.current &&
      routeKey !== initialRouteRef.current
    ) {
      setLoading(false);
    }
  }, [loading, routeKey]);

  // Safety net: never trap the user behind an overlay if navigation fails.
  useEffect(() => {
    if (!loading) return;

    const timeout = window.setTimeout(() => {
      setLoading(false);
    }, 12000);

    return () => window.clearTimeout(timeout);
  }, [loading]);

  const value = useMemo(
    () => ({
      startLoading,
      stopLoading,
    }),
    [startLoading, stopLoading],
  );

  return (
    <LoadingContext.Provider value={value}>
      {children}

      {loading ? (
        <div
          aria-label={message}
          aria-live="polite"
          className={styles.actionLoadingOverlay}
          role="status"
        >
          <div className={styles.actionLoadingCard}>
            <div className={styles.actionLoadingOrbit} aria-hidden="true">
              <span className={styles.actionLoadingRing} />
              <span className={styles.actionLoadingDot} />
              <span className={styles.actionLoadingMark}>A</span>
            </div>

            <div className={styles.actionLoadingCopy}>
              <strong>{message}</strong>
              <span>
                {locale === "pt-BR"
                  ? "AUREUM está atualizando sua visão financeira."
                  : "AUREUM is updating your financial view."}
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </LoadingContext.Provider>
  );
}

export function useDashboardActionLoading() {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error(
      "useDashboardActionLoading must be used inside DashboardActionLoadingProvider.",
    );
  }

  return context;
}
