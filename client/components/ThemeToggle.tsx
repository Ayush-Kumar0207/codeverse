"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Monitor, Moon, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useSettings, type ThemeType } from "@/context/SettingsContext";

interface ThemeToggleProps {
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const themeOptions: { id: ThemeType; label: string }[] = [
  { id: "midnight", label: "Midnight" },
  { id: "hacker", label: "Hacker" },
  { id: "solarized", label: "Solarized" },
  { id: "amoled", label: "AMOLED" },
];

export function ThemeToggle({ 
  variant = "ghost", 
  size = "icon",
  className 
}: ThemeToggleProps) {
  const { settings, updateSetting } = useSettings();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant={variant} size={size} className={cn("w-9 h-9", className)} disabled>
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  const currentTheme = settings.appearance.theme;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={cn("relative w-9 h-9", className)}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentTheme}
              initial={{ y: -20, opacity: 0, rotate: -90 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: 20, opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute"
            >
              {currentTheme === "amoled" ? (
                <Moon className="h-[1.2rem] w-[1.2rem] text-foreground" />
              ) : (
                <Palette className="h-[1.2rem] w-[1.2rem] text-foreground" />
              )}
            </motion.div>
          </AnimatePresence>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {themeOptions.map((theme) => (
          <DropdownMenuItem key={theme.id} onClick={() => updateSetting("appearance", { theme: theme.id })} className="gap-2">
            <Monitor className="h-4 w-4" />
            <span>{theme.label}</span>
            {currentTheme === theme.id && <Check className="ml-auto h-3.5 w-3.5 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Simple toggle button for quick switching
export function ThemeToggleSimple({ 
  variant = "ghost", 
  size = "icon",
  className 
}: ThemeToggleProps) {
  const { settings, updateSetting } = useSettings();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant={variant} size={size} className={cn("w-9 h-9", className)} disabled>
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  const currentIndex = themeOptions.findIndex((theme) => theme.id === settings.appearance.theme);
  const nextTheme = themeOptions[(currentIndex + 1) % themeOptions.length]?.id || "midnight";

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => updateSetting("appearance", { theme: nextTheme })}
      className={cn("relative w-9 h-9 overflow-hidden", className)}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={settings.appearance.theme}
          initial={{ y: 20, opacity: 0, rotate: 90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -20, opacity: 0, rotate: -90 }}
          transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
        >
          {settings.appearance.theme === "amoled" ? (
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Palette className="h-[1.2rem] w-[1.2rem]" />
          )}
        </motion.div>
      </AnimatePresence>
      <span className="sr-only">Cycle theme</span>
    </Button>
  );
}

export default ThemeToggle;
