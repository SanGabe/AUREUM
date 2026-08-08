"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import styles from "./dashboard-view.module.css";

type LoadingContextValue = {
  startLoading: (message?: string) => void;
  stopLoading: () => void;
};

const LoadingContext = createContext<LoadingContextValue | null>(null);

export function DashboardActionLoadingProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Carregando...");

  const startLoading = useCallback((nextMessage = "Carregando...") => {
    setMessage(nextMessage);
    setLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setLoading(false);
  }, []);

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
              <span>AUREUM está atualizando sua visão financeira.</span>
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
      "useDashboardActionLoading deve ser usado dentro de DashboardActionLoadingProvider.",
    );
  }

  return context;
}
