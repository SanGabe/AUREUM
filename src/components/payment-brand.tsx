import styles from "./payment-brand.module.css";

export type PaymentBrand =
  | "visa"
  | "mastercard"
  | "american-express"
  | "discover"
  | "jcb"
  | "paypal"
  | "pix"
  | "samsung-pay"
  | "apple-pay"
  | "alipay"
  | "google-pay";

const ASSETS: Record<PaymentBrand, string> = {
  visa: "/payment-brands/visa.svg",
  mastercard: "/payment-brands/mastercard.svg",
  "american-express": "/payment-brands/american-express.svg",
  discover: "/payment-brands/discover.svg",
  jcb: "/payment-brands/jcb.svg",
  paypal: "/payment-brands/paypal.svg",
  pix: "/payment-brands/pix.svg",
  "samsung-pay": "/payment-brands/samsung-pay.svg",
  "apple-pay": "/payment-brands/apple-pay.svg",
  alipay: "/payment-brands/alipay.svg",
  "google-pay": "/payment-brands/google-pay.svg",
};

const LABELS: Record<PaymentBrand, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  "american-express": "American Express",
  discover: "Discover",
  jcb: "JCB",
  paypal: "PayPal",
  pix: "Pix",
  "samsung-pay": "Samsung Pay",
  "apple-pay": "Apple Pay",
  alipay: "Alipay",
  "google-pay": "Google Pay",
};

export function PaymentBrandLogo({
  brand,
  compact = false,
}: {
  brand: PaymentBrand;
  compact?: boolean;
}) {
  return (
    <span
      className={
        compact
          ? `${styles.logo} ${styles.compact}`
          : styles.logo
      }
      title={LABELS[brand]}
    >
      <img src={ASSETS[brand]} alt={LABELS[brand]} />
    </span>
  );
}
