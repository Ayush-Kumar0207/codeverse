import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function useNavigationMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = useCallback(() => {
    logout();
    // Use router.push instead of location.reload for better UX
    router.push("/login");
  }, [logout, router]);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  return {
    menuOpen,
    toggleMenu,
    closeMenu,
    handleLogout,
  };
}
