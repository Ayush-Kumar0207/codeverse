"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  Cpu, 
  History, 
  MessageSquare, 
  Zap, 
  Github, 
  ChevronRight, 
  Command,
  Layout,
  Globe,
  Plus
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import NewProjectModal from "@/components/NewProjectModal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

// --- Atmosphere Component ---
const Atmosphere = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    <div className="absolute inset-0 noise-bg" />
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.6 }}
      transition={{ duration: 2 }}
      className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] glow-orb rounded-full" 
    />
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.4 }}
      transition={{ duration: 2, delay: 0.5 }}
      className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] glow-orb-secondary rounded-full" 
    />
  </div>
);

// --- IDE Mockup Component ---
const IDEMockup = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 5 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="relative w-full max-w-5xl mx-auto aspect-video rounded-xl border border-primary/20 bg-[#020617]/90 glass-effect shadow-2xl overflow-hidden group"
      style={{ perspective: "1000px" }}
    >
      {/* OS Header */}
      <div className="h-9 w-full bg-black/40 border-b border-white/5 flex items-center px-4 gap-2">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
        </div>
        <div className="mx-auto text-[10px] text-muted-foreground font-medium opacity-50 tracking-widest uppercase">
          codeverse_enterprise_shell.app
        </div>
      </div>

      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-48 bg-black/40 border-r border-white/5 p-4 space-y-4 hidden md:block">
          <div className="space-y-1.5">
             <div className="h-2 w-20 bg-primary/20 rounded-full" />
             <div className="h-2 w-32 bg-white/5 rounded-full" />
             <div className="h-2 w-24 bg-white/5 rounded-full" />
             <div className="h-2 w-28 bg-white/5 rounded-full" />
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-6 font-mono text-sm space-y-2">
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            className="flex gap-2"
          >
            <span className="text-primary">const</span>
            <span className="text-indigo-300">collaborate</span>
            <span className="text-white">=</span>
            <span className="text-yellow-400">() {"=>"}</span>
            <span className="text-white">{"{"}</span>
          </motion.div>
          <div className="pl-6 text-muted-foreground opacity-50">
            // Real-time synchronization active
          </div>
          <div className="pl-6 flex gap-2">
            <span className="text-primary">await</span>
            <span className="text-indigo-300">CodeVerse</span>
            <span className="text-white">.sync();</span>
          </div>
          <div className="text-white">{"}"}</div>

          {/* Floating Cursors Simulation */}
          <motion.div 
             animate={{ x: [0, 150, 80], y: [0, 40, 0] }}
             transition={{ duration: 4, repeat: Infinity }}
             className="absolute top-20 left-40 flex items-center gap-1"
          >
            <LucideCursor color="#6366F1" name="Ayush" />
          </motion.div>
          
          <motion.div 
             animate={{ x: [0, -100, -50], y: [0, -20, 20] }}
             transition={{ duration: 6, repeat: Infinity }}
             className="absolute bottom-20 right-40 flex items-center gap-1"
          >
            <LucideCursor color="#F43F5E" name="Collaborator" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const LucideCursor = ({ color, name }: { color: string, name: string }) => (
  <div className="relative group">
     <ArrowCursor color={color} />
     <div 
       className="absolute left-4 top-4 px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-lg whitespace-nowrap"
       style={{ backgroundColor: color }}
     >
       {name}
     </div>
  </div>
);

const ArrowCursor = ({ color }: { color: string }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0L14 7L7 14L5 9L0 7V0Z" fill={color} />
  </svg>
);

// --- Component Definition ---
export default function HomePage() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const features = [
    {
      title: "Real-Time Engine",
      desc: "Architected for sub-50ms latency collaboration globally.",
      icon: Zap,
      color: "text-amber-400",
      bg: "bg-amber-400/10"
    },
    {
      title: "A.I. Core",
      desc: "Neural-assisted coding with deep project context integration.",
      icon: Cpu,
      color: "text-indigo-400",
      bg: "bg-indigo-400/10"
    },
    {
      title: "Enterprise History",
      desc: "Immaculate version snapshots with instant rollback capabilities.",
      icon: History,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10"
    },
    {
      title: "Tactile Chat",
      desc: "Integrated team communication built directly into the grid.",
      icon: MessageSquare,
      color: "text-pink-400",
      bg: "bg-pink-400/10"
    },
    {
      title: "Midnight UI",
      desc: "High-density design engineered for professional power users.",
      icon: Layout,
      color: "text-primary",
      bg: "bg-primary/10"
    },
    {
      title: "Open Deployment",
      desc: "One-click deployment to global edge infrastructures.",
      icon: Globe,
      color: "text-blue-400",
      bg: "bg-blue-400/10"
    }
  ];

  return (
    <TooltipProvider>
    <div className="relative min-h-screen bg-background font-sans selection:bg-primary/30 scroll-smooth">
      <Atmosphere />

      {/* --- Sticky Header --- */}
      <header className="fixed top-0 inset-x-0 mx-auto z-50 p-4">
        <nav className="glass-effect rounded-2xl px-6 py-4 flex flex-wrap items-center justify-between border-white/5 bg-black/20 backdrop-blur-md">
          <Link href="/" className="flex items-center gap-2 group order-1 md:order-none">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <Command className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white font-outfit">CodeVerse</span>
          </Link>

            <div className="flex flex-wrap items-center gap-4 md:gap-8 justify-center w-full md:w-auto mt-4 md:mt-0 order-3 md:order-none">
              {[
                { label: "Technology", href: "#technology" },
                { label: "Features", href: "#features" },
                { label: "Collaboration", href: "#collaboration" }
              ].map((link) => (
                <Link 
                  key={link.label} 
                  href={link.href} 
                  className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-black text-muted-foreground hover:text-primary transition-all hover:scale-105 active:scale-95"
                >
                  {link.label}
                </Link>
              ))}
            </div>

          <div className="flex items-center gap-4 order-2 md:order-none ml-auto md:ml-0">
            {!user ? (
               <Link href="/login">
                <Button variant="ghost" className="text-white hover:bg-white/5">Sign In</Button>
               </Link>
            ) : (
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-white hover:bg-white/5">Dashboard</Button>
                </Link>
            )}
            <Link href={user ? "/dashboard" : "/login"}>
               <Button className="bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 font-bold px-6">
                 Get Started
               </Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="relative z-10 pt-32 pb-20">
        {/* --- Hero Section --- */}
        <section className="max-w-7xl mx-auto px-6 text-center mb-32 pt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest mb-8"
          >
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            V2.0 Midnight Release Now Live
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-6xl md:text-8xl font-black font-outfit tracking-tighter text-white mb-6 leading-[0.9]"
          >
            Immaculate <br />
            <span className="text-gradient">Collaboration.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground/80 max-w-2xl mx-auto mb-12 font-inter leading-relaxed"
          >
            Architected for the forward-thinking developer. A God-Level IDE shell engineered for real-time multiplayer coding with deep A.I. integration.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 mb-24"
          >
            <Button 
              size="lg" 
              onClick={() => user ? setShowModal(true) : window.location.href = "/login"}
              className="h-14 px-10 bg-primary text-white text-lg font-bold rounded-xl shadow-2xl shadow-primary/30 hover:scale-105 transition-all"
            >
              Start New Project
            </Button>
            <Link href="/demo">
              <Button 
                size="lg" 
                variant="outline" 
                className="h-14 px-10 border-white/10 text-white bg-white/5 hover:bg-white/10 rounded-xl hover:scale-105 transition-all"
              >
                Watch Demo
              </Button>
            </Link>
          </motion.div>

          {/* Software Showcase */}
          <section id="technology" className="pt-24 mt-20">
            <IDEMockup />
          </section>
        </section>

        {/* --- Active Now Section --- */}
        <section id="collaboration" className="max-w-4xl mx-auto px-6 mb-40 text-center pt-20">
            <h2 className="text-xs font-bold text-primary uppercase tracking-[0.4em] mb-12">Active Now</h2>
            <div className="flex flex-wrap justify-center gap-6">
               {[
                 { name: "Ayush", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ayush" },
                 { name: "Sarah", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
                 { name: "John", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John" },
                 { name: "Emma", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma" }
               ].map((u, i) => (
                 <motion.div 
                  key={u.name}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center gap-2 group cursor-pointer"
                 >
                    <div className="w-16 h-16 rounded-full border-2 border-primary/20 bg-background/80 p-1 group-hover:border-primary transition-all group-hover:scale-110">
                       <img src={u.avatar} alt={u.name} className="w-full h-full rounded-full" />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-0 group-hover:opacity-100 transition-opacity tracking-widest">{u.name}</span>
                 </motion.div>
               ))}
               <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="w-16 h-16 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center text-white/40 hover:border-primary hover:text-primary transition-all cursor-pointer"
                >
                  <Plus className="w-6 h-6" />
                </motion.div>
            </div>
        </section>

        {/* --- Features Grid --- */}
        <section id="features" className="max-w-7xl mx-auto px-6 mb-40 pt-32">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-8 rounded-2xl glass-effect group cursor-pointer relative overflow-hidden border-white/5 bg-black/40"
                >
                  {/* Icon Glow */}
                  <div className={cn("absolute -top-10 -left-10 w-32 h-32 blur-[40px] opacity-20 transition-opacity group-hover:opacity-40", f.bg)} />
                  
                  <div className={cn("inline-flex p-3 rounded-lg mb-6", f.bg)}>
                    <f.icon className={cn("w-6 h-6", f.color)} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 font-outfit">{f.title}</h3>
                  <p className="text-sm text-muted-foreground font-inter leading-relaxed">
                    {f.desc}
                  </p>
                </motion.div>
              ))}
           </div>
        </section>

        {/* --- CTA Section --- */}
        <section className="max-w-5xl mx-auto px-6 text-center">
           <div className="p-12 md:p-20 rounded-3xl glass-effect border border-primary/20 relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full glow-orb opacity-10" />
              <h2 className="text-4xl md:text-6xl font-black font-outfit text-white mb-6 tracking-tighter">
                Ready for the <br />
                <span className="text-gradient">Next Generation?</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-10 text-lg leading-relaxed">
                Join thousands of engineers building the world's most immaculate software with CodeVerse.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                 <Button 
                   size="lg" 
                   className="h-14 px-10 bg-primary text-white font-bold group"
                   onClick={() => window.location.href = "/login"}
                 >
                   Deploy Now
                   <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                 </Button>
              </div>
           </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="border-t border-primary/10 py-12 px-6 bg-black/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-2">
              <Command className="w-6 h-6 text-primary" />
              <span className="text-lg font-black tracking-tighter text-white font-outfit uppercase">CodeVerse</span>
           </div>
           
           <div className="flex gap-8 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
             <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
             <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
             <Link href="#" className="hover:text-primary transition-colors">Twitter</Link>
             <Link href="https://github.com" className="hover:text-primary transition-colors flex items-center gap-1">
               <Github className="w-3 h-3" />
               Source
             </Link>
           </div>

           <div className="text-[10px] text-muted-foreground/30 font-mono tracking-tighter">
              © {new Date().getFullYear()} CODEVERSE_SYSTEMS_INTL v2.0.4-STABLE
           </div>
        </div>
      </footer>

      {/* Modals */}
      <AnimatePresence>
        {showModal && (
          <NewProjectModal onClose={() => setShowModal(false)} />
        )}
      </AnimatePresence>

      <style jsx global>{`
        .font-outfit { font-family: 'Outfit', sans-serif; }
        .font-inter { font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
    </TooltipProvider>
  );
}
