import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import ClientWrapper from "./ClientWrapper"; // ✅ Contains NavBar + ThemeProvider

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CodeVerse – Real-time AI Code Editor",
  description: "Collaborate, edit, and chat with AI in real-time.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const themeBootstrap = `
    (function () {
      try {
        var raw = localStorage.getItem("codeverse-settings");
        if (!raw) return;
        var settings = JSON.parse(raw);
        var theme = settings && settings.appearance && settings.appearance.theme;
        var scale = settings && settings.appearance && settings.appearance.scale;
        var allowed = ["midnight", "hacker", "solarized", "amoled"];
        if (allowed.indexOf(theme) !== -1) {
          document.documentElement.setAttribute("data-theme", theme);
          document.documentElement.classList.add("dark");
        }
        if (typeof scale === "number" && Number.isFinite(scale)) {
          document.documentElement.style.setProperty("--ui-scale", scale + "rem");
        }
      } catch (error) {}
    })();
  `;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} min-h-screen w-full`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className="min-h-screen w-full bg-background text-foreground">
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}
