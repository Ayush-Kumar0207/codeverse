"use client";

import * as React from "react";
import {
  Settings,
  Shield,
  Zap,
  Layout,
  Activity,
  LogOut,
  Terminal,
  Cpu,
  Layers,
  Wind,
  Orbit,
  FlaskConical,
  UserPlus,
  Share2,
  Code2,
  FileSearch,
  Wand2
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
import { useShellContext } from "@/hooks/useShellContext";
import { motion, AnimatePresence } from "framer-motion";

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const { setTheme, theme } = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const { isEditor, isEncyclopedia, currentContext } = useShellContext();
  const [isScanning, setIsScanning] = React.useState(false);

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

  const simulateAudit = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setOpen(false);
      // Here we could trigger a toast or notification
      alert("System Audit Complete: All neural clusters functioning within optimal parameters.");
    }, 1500);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <div className="relative flex flex-col scanner-glow">
        <div className="flex items-center border-b border-white/5 px-3">
          <Terminal className="mr-2 h-4 w-4 text-primary opacity-50" />
          <CommandInput 
            placeholder="SYSTEM_CMD.EXE > _" 
            className="terminal-prompt h-12 bg-transparent border-none focus:ring-0 placeholder:opacity-30"
          />
        </div>
        
        <CommandList className="no-scrollbar max-h-[380px] mb-2">
          <CommandEmpty className="py-12 flex flex-col items-center justify-center gap-2 opacity-50">
             <Layers className="h-8 w-8 animate-pulse text-primary" />
             <p className="text-xs font-mono uppercase tracking-widest">Command not recognized in {currentContext} context.</p>
          </CommandEmpty>
          
          <CommandGroup heading="System Intelligence">
            <CommandItem onSelect={simulateAudit} className="group py-3">
              <Activity className="mr-2 h-4 w-4 text-primary group-hover:animate-spin" />
              <div className="flex flex-col">
                <span className="font-bold">Audit System Health</span>
                <span className="text-[10px] opacity-40 uppercase tracking-tighter">Run deep diagnostics on neural clusters</span>
              </div>
              <CommandShortcut>⌘H</CommandShortcut>
            </CommandItem>
            
            <CommandItem onSelect={() => runCommand(() => setTheme(theme === 'dark' ? 'light' : 'dark'))} className="py-3">
              {theme === 'dark' ? <Wind className="mr-2 h-4 w-4 text-blue-400" /> : <Orbit className="mr-2 h-4 w-4 text-amber-500" />}
              <div className="flex flex-col">
                <span className="font-bold">Shift Atmosphere</span>
                <span className="text-[10px] opacity-40 uppercase tracking-tighter">Toggle between Solar and Midnight protocols</span>
              </div>
              <CommandShortcut>⌘A</CommandShortcut>
            </CommandItem>

            <CommandItem onSelect={() => runCommand(() => {})} className="py-3">
              <FlaskConical className="mr-2 h-4 w-4 text-emerald-400" />
              <div className="flex flex-col">
                <span className="font-bold">Toggle Hyper-Resolution</span>
                <span className="text-[10px] opacity-40 uppercase tracking-tighter">Enable immaculate UI focus mode</span>
              </div>
            </CommandItem>
          </CommandGroup>

          {isEditor && (
            <>
              <CommandSeparator className="opacity-10" />
              <CommandGroup heading="Neural Development Execution">
                <CommandItem onSelect={() => runCommand(() => {})} className="py-3 group active-selection-glow">
                  <Wand2 className="mr-2 h-4 w-4 text-primary group-hover:animate-bounce" />
                  <div className="flex flex-col">
                    <span className="font-bold">Optimize Active Selection</span>
                    <span className="text-[10px] opacity-40 uppercase tracking-tighter">A.I. Refactoring and Time-Complexity optimization</span>
                  </div>
                  <CommandShortcut>⌘O</CommandShortcut>
                </CommandItem>
                <CommandItem onSelect={() => runCommand(() => {})} className="py-3">
                  <FileSearch className="mr-2 h-4 w-4 text-indigo-400" />
                  <div className="flex flex-col">
                    <span className="font-bold">Scan for Edge Cases</span>
                    <span className="text-[10px] opacity-40 uppercase tracking-tighter">Generate adversarial tests for simulation</span>
                  </div>
                </CommandItem>
              </CommandGroup>
            </>
          )}

          <CommandSeparator className="opacity-10" />

          <CommandGroup heading="Platform Warp">
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard"))} className="py-3">
              <Layout className="mr-2 h-4 w-4" />
              <div className="flex flex-col">
                <span className="font-bold">Return to Command Dashboard</span>
                <span className="text-[10px] opacity-40 uppercase tracking-tighter">Warp to project management center</span>
              </div>
              <CommandShortcut>⇧⌘D</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/profile"))} className="py-3">
              <Shield className="mr-2 h-4 w-4 text-amber-500" />
              <div className="flex flex-col">
                <span className="font-bold">Neural Identity</span>
                <span className="text-[10px] opacity-40 uppercase tracking-tighter">Configure profile and social signatures</span>
              </div>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator className="opacity-10" />

          <CommandGroup heading="Collaboration Protocols">
            <CommandItem onSelect={() => runCommand(() => {})} className="py-3">
              <UserPlus className="mr-2 h-4 w-4 text-indigo-400" />
              <div className="flex flex-col">
                <span className="font-bold">Invite Neural Asset</span>
                <span className="text-[10px] opacity-40 uppercase tracking-tighter">Generate secure collaboration link</span>
              </div>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => {})} className="py-3">
              <Share2 className="mr-2 h-4 w-4 text-primary" />
              <div className="flex flex-col">
                <span className="font-bold">Broadcast Session</span>
                <span className="text-[10px] opacity-40 uppercase tracking-tighter">Publish current sandbox to global feed</span>
              </div>
            </CommandItem>
          </CommandGroup>

          {user && (
            <>
              <CommandSeparator className="opacity-10" />
              <CommandGroup heading="Security">
                <CommandItem onSelect={() => runCommand(() => {})} className="py-3 text-destructive/80 hover:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span className="font-bold">Terminate Session</span>
                    <span className="text-[10px] opacity-40 uppercase tracking-tighter line-clamp-1">Eject from CodeVerse Kernal</span>
                  </div>
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </CommandList>
        
        {/* Intelligence HUD Footer */}
        <div className="flex items-center justify-between border-t border-white/5 bg-black/40 p-2.5 px-4 text-[9px] font-mono text-muted-foreground/60 uppercase tracking-widest shrink-0">
           <div className="flex items-center gap-2">
              <div className={`h-1.5 w-1.5 rounded-full ${isScanning ? 'bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]'}`} />
              <span>Shell Context: {currentContext}</span>
           </div>
           <div className="opacity-40 whitespace-nowrap">v2.0.4-GOD_MODE_ACTIVE</div>
        </div>
      </div>

      <AnimatePresence>
        {isScanning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-8 text-center"
          >
             <div className="flex flex-col items-center gap-4">
                <Zap className="h-12 w-12 text-primary animate-pulse" />
                <div className="space-y-1">
                  <p className="font-mono text-primary animate-bounce">SCANNING_NEURAL_SYNAPSE...</p>
                  <div className="h-1 w-48 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="h-full w-1/2 bg-primary"
                    />
                  </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </CommandDialog>
  );
}
