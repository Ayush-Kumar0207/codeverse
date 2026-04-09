"use client";
import Link from "next/link";
import { Menu, X, UserCircle, LogOut } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useNavigationMenu } from "@/hooks/useNavigationMenu";

export default function NavBarPrivate() {
  const { menuOpen, toggleMenu, closeMenu, handleLogout } =
    useNavigationMenu();

  return (
    <nav className="bg-[#0a0a0a] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="text-2xl font-extrabold tracking-tight">
            <Link
              href="/"
              className="hover:text-primary transition duration-200"
            >
              Code<span className="text-primary">Verse</span>
            </Link>
          </div>

          <div className="hidden md:flex space-x-6 items-center text-sm">
            <Link href="/" className="hover:text-purple-400">
              Home
            </Link>
            <Link href="/about" className="hover:text-purple-400">
              About Us
            </Link>

            <div className="relative group">
              <Link href="/profile">
                <UserCircle className="w-6 h-6 cursor-pointer" />
              </Link>
              <div className="absolute right-0 mt-2 w-32 bg-gray-900 border border-gray-700 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-50">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-800"
                >
                  <LogOut className="inline w-4 h-4 mr-1" /> Logout
                </button>
              </div>
            </div>

            <ThemeToggle />
          </div>

          <div className="md:hidden">
            <button onClick={toggleMenu}>
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-2 bg-gray-800 border-t border-gray-700">
          <Link
            href="/"
            className="block text-sm hover:text-purple-400"
            onClick={closeMenu}
          >
            Home
          </Link>
          <Link
            href="/about"
            className="block text-sm hover:text-purple-400"
            onClick={closeMenu}
          >
            About Us
          </Link>
          <Link
            href="/profile"
            className="block text-sm hover:text-purple-400"
            onClick={closeMenu}
          >
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="block text-sm hover:text-purple-400 w-full text-left"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
