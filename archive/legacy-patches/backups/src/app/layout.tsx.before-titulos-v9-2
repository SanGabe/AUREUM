import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import "./theme.css";

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
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#00142f" },
    { media: "(prefers-color-scheme: light)", color: "#f7f3ea" },
  ],
};

const themeBootScript = `
(() => {
  try {
    const stored = localStorage.getItem("aureum-theme");
    const theme =
      stored === "light" || stored === "contrast" || stored === "dark"
        ? stored
        : "dark";

    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme =
      theme === "light" ? "light" : "dark";
  } catch {
    document.documentElement.dataset.theme = "dark";
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      data-theme="dark"
      lang="pt-BR"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: themeBootScript }}
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
