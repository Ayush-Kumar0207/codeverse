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
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} min-h-screen w-full`}
      suppressHydrationWarning
    >
      <body className="bg-[var(--background)] text-[var(--foreground)] min-h-screen w-full">
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}
