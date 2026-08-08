import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AUREUM — Seu app de finanças unificado",
    template: "%s | AUREUM",
  },
  description:
    "Organize contas, cartões, metas e a vida financeira da sua casa em uma experiência clara, elegante e moderna.",
  icons: {
    icon: [{ url: "/brand/aureum-emblem-hq.png", type: "image/png" }],
    shortcut: "/brand/aureum-emblem-hq.png",
    apple: "/brand/aureum-emblem-hq.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#00142f",
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
