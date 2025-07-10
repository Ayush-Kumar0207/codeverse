"use client";

import Link from "next/link";
import { ThemeProvider } from "next-themes"; // Add ThemeProvider

export default function AboutPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] px-6 py-12 md:px-20 transition-colors duration-300">
        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-purple-400 to-indigo-600 bg-clip-text text-transparent">
          About CodeVerse
        </h1>

        {/* Mission */}
        <section className="mb-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-purple-400 mb-4">🚀 Our Mission</h2>
          <p className="text-[var(--muted)] text-lg">
            CodeVerse was created to empower developers by making real-time coding,
            collaboration, and learning accessible from anywhere — without the hassle of setup.
            Our mission is to simplify how teams code together, integrate AI in a meaningful way,
            and provide a space where ideas turn into deployable reality faster.
          </p>
        </section>

        {/* Vision */}
        <section className="mb-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-indigo-400 mb-4">🌍 Our Vision</h2>
          <p className="text-[var(--muted)] text-lg">
            We envision a world where building software is as easy as writing thoughts.
            Whether you&rsquo;re a student, solo dev, or startup team — CodeVerse lets you prototype,
            code, discuss, and launch — all in one place.
          </p>
        </section>

        {/* Why CodeVerse */}
        <section className="mb-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-pink-400 mb-4">✨ What Makes CodeVerse Unique?</h2>
          <ul className="list-disc list-inside space-y-3 text-[var(--muted)] text-lg">
            <li>🧠 <strong>AI-Powered</strong>: Context-aware suggestions powered by LLMs</li>
            <li>🧑‍🤝‍🧑 <strong>Collaborative</strong>: Built-in WebSocket support for real-time teamwork</li>
            <li>💬 <strong>Live Chat</strong>: No more context-switching between editor and messages</li>
            <li>🎯 <strong>Focused UX</strong>: Clean, distraction-free interface inspired by minimal IDEs</li>
            <li>🔐 <strong>GitHub Integration</strong>: Login & sync code easily</li>
          </ul>
        </section>

        {/* Team */}
        <section className="mb-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-4">👥 Meet the Creator</h2>
          <p className="text-[var(--muted)] text-lg">
            CodeVerse is an open-source project crafted with passion by
            <span className="text-[var(--foreground)] font-semibold"> Ayush Kumar</span>.
            Explore more on our
            <Link
              href="https://github.com/ayush-coder"
              target="_blank"
              className="ml-1 text-indigo-400 underline hover:text-indigo-300"
            >
              GitHub
            </Link>.
          </p>
        </section>

        {/* CTA */}
        <section className="text-center mt-20">
          <h3 className="text-2xl font-bold mb-4">Ready to code with us?</h3>
          <Link
            href="/login"
            className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg text-lg font-semibold transition"
          >
            Get Started
          </Link>
        </section>

        {/* Footer */}
        <footer className="mt-24 border-t border-gray-800 pt-6 text-sm text-gray-500 text-center">
          © {new Date().getFullYear()} CodeVerse — Made with 💜 for devs
        </footer>
      </main>
    </ThemeProvider>
  );
}
