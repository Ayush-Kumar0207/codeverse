"use client";

import Link from "next/link";
import { ThemeProvider } from "next-themes";
import { useAuth } from "@/context/AuthContext";
import NewProjectModal from "@/components/NewProjectModal";
import { useState } from "react";

export default function HomePage() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] px-6 py-10 md:px-20 transition-colors duration-300">
        
        {/* ✅ Hero Section */}
        <section className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gradient">
            CodeVerse
          </h1>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            A next-gen real-time code editor powered by AI, built for developers and teams to collaborate faster and smarter.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            {!user ? (
              <>
                <Link
                  href="/login"
                  className="bg-[var(--primary)] hover:bg-purple-700 px-6 py-3 rounded-md font-semibold transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/demo"
                  className="border border-gray-500 hover:border-[var(--primary)] text-[var(--foreground)] px-6 py-3 rounded-md font-semibold transition"
                >
                  Try Demo
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-md font-semibold transition"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={() => setShowModal(true)}
                  className="border border-gray-500 hover:border-[var(--primary)] text-[var(--foreground)] px-6 py-3 rounded-md font-semibold transition"
                >
                  Start New Project
                </button>
              </>
            )}
          </div>

          {/* ✅ New Project Modal */}
          {showModal && (
            <NewProjectModal onClose={() => setShowModal(false)} />
          )}
        </section>

        {/* Features */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            {
              title: "⚡ Real-Time Collaboration",
              desc: "Code with teammates in sync using blazing-fast WebSocket technology.",
            },
            {
              title: "🤖 AI Suggestions",
              desc: "Smart autocomplete and refactoring using OpenAI's Codex engine.",
            },
            {
              title: "🔐 GitHub Login",
              desc: "Sign in with your GitHub to manage files and projects securely.",
            },
            {
              title: "🕒 Version Control",
              desc: "Rewind any time with built-in version snapshots.",
            },
            {
              title: "💬 Built-in Chat",
              desc: "Communicate instantly without switching tools.",
            },
            {
              title: "🌐 Markdown & Preview",
              desc: "Live markdown preview for docs and READMEs.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="border border-gray-700 rounded-lg p-6 hover:border-[var(--primary)] transition"
            >
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </section>

        {/* How It Works */}
        <section className="mb-20">
          <h2 className="text-3xl font-semibold mb-6">How It Works</h2>
          <ol className="space-y-4 list-decimal list-inside text-gray-400">
            <li>Create or join a coding room using a unique link</li>
            <li>Write code collaboratively in real time using our AI-powered editor</li>
            <li>Discuss ideas live via built-in chat and save versions anytime</li>
          </ol>
        </section>

        {/* Final CTA */}
        <section className="text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Code Smarter?</h3>
          <Link
            href={user ? "/dashboard" : "/login"}
            className="bg-pink-600 hover:bg-pink-700 px-8 py-3 rounded-lg text-lg font-semibold transition"
          >
            {user ? "Go to Dashboard" : "Get Started Now"}
          </Link>
        </section>

        {/* Footer */}
        <footer className="mt-24 border-t border-gray-800 pt-6 text-sm text-gray-500 text-center">
          © {new Date().getFullYear()} CodeVerse — Built with ❤️ for Developers
        </footer>
      </main>
    </ThemeProvider>
  );
}
