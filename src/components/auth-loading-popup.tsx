import styles from "./auth.module.css";

export function AuthLoadingPopup({ english = false }: { english?: boolean }) {
  return (
    <div className={styles.loginPopupBackdrop} aria-live="assertive" role="status">
      <div className={styles.loginPopup} role="dialog" aria-modal="true" aria-labelledby="login-loading-title">
        <div className={styles.loginPopupMark} aria-hidden="true">
          <span />
          <b>A</b>
        </div>
        <div>
          <strong id="login-loading-title">
            {english ? "Opening your AUREUM" : "Abrindo seu AUREUM"}
          </strong>
          <p>
            {english
              ? "We are validating your access and preparing your financial Nucleus."
              : "Estamos validando seu acesso e preparando seu Núcleo financeiro."}
          </p>
        </div>
      </div>
    </div>
  );
}
