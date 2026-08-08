import styles from "./loading.module.css";

export default function Loading() {
  return (
    <div
      aria-label="Carregando página"
      aria-live="polite"
      className={styles.overlay}
      role="status"
    >
      <div className={styles.content}>
        <div className={styles.orbit} aria-hidden="true">
          <span className={styles.ring} />
          <span className={styles.dot} />
          <span className={styles.centerMark}>A</span>
        </div>

        <div className={styles.copy}>
          <strong>Carregando</strong>
          <span>Organizando sua experiência AUREUM...</span>
        </div>
      </div>
    </div>
  );
}
