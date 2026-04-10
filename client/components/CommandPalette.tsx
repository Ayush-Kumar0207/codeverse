"use client";

import * as React from "react";
import {
  Settings,
  Search,
  Code,
  Play,
  Moon,
  Sun,
  Shield,
  Zap,
  Globe,
  Plus,
  Layout,
  Terminal,
  Activity,
  LifeBuoy,
  LogOut
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const { setTheme } = useTheme();
  const router = useRouter();
  const { user } = useAuth();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    const toggle = () => setOpen((open) => !open);

    document.addEventListener("keydown", down);
    window.addEventListener("toggle-command-palette", toggle);
    
    return () => {
      document.removeEventListener("keydown", down);
      window.removeEventListener("toggle-command-palette", toggle);
    };
  }, []);

  const runCommand = (action: () => void) => {
    action();
    setOpen(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search platform..." />
      <CommandList className="no-scrollbar">
        <CommandEmpty>No results found for your query.</CommandEmpty>
        
        <CommandGroup heading="System">
          <CommandItem onSelect={() => runCommand(() => window.location.reload())}>
            <Activity className="mr-2 h-4 w-4" />
            <span>Check System Health</span>
            <CommandShortcut>⌘H</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
            <Moon className="mr-2 h-4 w-4" />
            <span>Switch to Dark Mode</span>
            <CommandShortcut>⌘D</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
            <Sun className="mr-2 h-4 w-4" />
            <span>Switch to Light Mode</span>
            <CommandShortcut>⌘L</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Workspace">
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard"))}>
            <Layout className="mr-2 h-4 w-4" />
            <span>Open Dashboard</span>
            <CommandShortcut>⇧⌘D</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/editor/demo-sandbox?mode=demo"))}>
            <Code className="mr-2 h-4 w-4" />
            <span>Launch Sandbox Editor</span>
            <CommandShortcut>⌘E</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => {})}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Create New Project</span>
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Resources">
          <CommandItem onSelect={() => runCommand(() => window.open("https://github.com", "_blank"))}>
            <Globe className="mr-2 h-4 w-4" />
            <span>Platform Documentation</span>
            <CommandShortcut>⌘?</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => {})}>
            <LifeBuoy className="mr-2 h-4 w-4" />
            <span>Contact Core Support</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => {})}>
            <Shield className="mr-2 h-4 w-4" />
            <span>Privacy & Security</span>
          </CommandItem>
        </CommandGroup>

        {user && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Account">
               <CommandItem onSelect={() => runCommand(() => router.push("/profile"))}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Account Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => {})}>
                <LogOut className="mr-2 h-4 w-4 text-destructive" />
                <span>Sign Out</span>
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
