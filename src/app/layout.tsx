import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AUREUM",
    template: "%s | AUREUM",
  },
  description:
    "Organização financeira para pessoas e casais, com WhatsApp, faturas, extratos e Google Sheets.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
