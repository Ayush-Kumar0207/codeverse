"use client";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

export default function NavBarPublic() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-[#0a0a0a] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="text-2xl font-extrabold tracking-tight">
            <Link href="/" className="hover:text-primary transition duration-200">
              Code<span className="text-primary">Verse</span>
            </Link>
          </div>

          <div className="hidden md:flex space-x-6 items-center text-sm">
            <Link href="/" className="hover:text-purple-400">Home</Link>
            <Link href="/about" className="hover:text-purple-400">About</Link>
            <Link href="/login" className="hover:text-purple-400">Login</Link>
            <ThemeToggle />
          </div>

          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-2 bg-gray-800 border-t border-gray-700">
          <Link href="/" className="block text-sm hover:text-purple-400">Home</Link>
          <Link href="/about" className="block text-sm hover:text-purple-400">About</Link>
          <Link href="/login" className="block text-sm hover:text-purple-400">Login</Link>
        </div>
      )}
    </nav>
  );
}
