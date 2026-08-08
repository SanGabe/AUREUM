import type { ReactNode } from "react";
import styles from "./page-transition.module.css";

export default function Template({
  children,
}: {
  children: ReactNode;
}) {
  return <div className={styles.page}>{children}</div>;
}
