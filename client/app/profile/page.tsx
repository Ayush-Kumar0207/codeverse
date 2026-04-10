"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { fetchSavedCodes } from "@/services/code";
import type { SharedVersion } from "@shared/types/version";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Mail, 
  Fingerprint, 
  ShieldCheck, 
  Zap, 
  LineChart, 
  Database, 
  LogOut, 
  FileCode,
  Globe,
  Lock,
  History,
  Code
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [savedCodes, setSavedCodes] = useState<SharedVersion[]>([]);

  useEffect(() => {
    if (!user || !token) {
      router.push("/login");
      return;
    }

    const fetchSavedCodesData = async () => {
      try {
        const res = await fetchSavedCodes(user._id || "");
        setSavedCodes(res.codes || []);
      } catch (err) {
        console.error("Failed to fetch saved codes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedCodesData();
  }, [user, token, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center">
      {/* Ambient Visuals */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] glow-orb opacity-30 select-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] glow-orb-secondary opacity-20 select-none" />
      <div className="fixed inset-0 noise-bg pointer-events-none opacity-20" />

      <main className="w-full max-w-5xl px-8 py-12 relative z-10 flex flex-col gap-12">
        
        {/* Header / Brand */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center gap-3">
             <div className="h-0.5 w-12 bg-primary" />
             <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">System Identification</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black font-outfit uppercase tracking-tighter">
            Neural <span className="text-primary italic">Identity</span>
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* Left Column: Identity Slab & Metrics */}
           <div className="lg:col-span-5 flex flex-col gap-8">
              
              {/* Identity Slab */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-effect rounded-3xl border-white/5 p-8 relative overflow-hidden group"
              >
                 <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Fingerprint className="w-24 h-24" />
                 </div>

                 <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-lg shadow-primary/10">
                       <User className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                       <h2 className="text-2xl font-bold font-outfit leading-none">{user.username}</h2>
                       <p className="text-muted-foreground text-xs mt-1 font-mono uppercase tracking-widest">{user.email || "Anon Node"}</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                       <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Verification Key</span>
                       <div className="bg-black/40 px-3 py-2 rounded-lg border border-white/5 flex items-center justify-between font-mono text-xs">
                          <span className="truncate mr-2">{user._id}</span>
                          <Lock className="w-3 h-3 text-primary/50" />
                       </div>
                    </div>
                 </div>

                 <button
                    onClick={handleLogout}
                    className="mt-10 w-full flex items-center justify-center gap-2 border border-red-500/20 bg-red-500/5 text-red-500 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-95"
                 >
                    <LogOut className="w-4 h-4" />
                    Terminate Session
                 </button>
              </motion.div>

              {/* Bento Stats */}
              <div className="grid grid-cols-2 gap-4">
                 {[
                   { label: "Security Tier", val: "L4", icon: ShieldCheck, color: "text-green-400" },
                   { label: "Neural Sync", val: "Active", icon: Zap, color: "text-yellow-400" },
                   { label: "Dev Score", val: "2,840", icon: LineChart, color: "text-blue-400" },
                   { label: "Artifacts", val: savedCodes.length, icon: Database, color: "text-purple-400" },
                 ].map((stat, i) => (
                   <motion.div 
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                    className="glass-effect p-5 rounded-2xl border-white/5 flex flex-col justify-between h-32"
                   >
                     <stat.icon className={cn("w-6 h-6", stat.color)} />
                     <div>
                        <p className="text-white font-black text-xl leading-none">{stat.val}</p>
                        <p className="text-muted-foreground text-[10px] uppercase tracking-tighter mt-1">{stat.label}</p>
                     </div>
                   </motion.div>
                 ))}
              </div>
           </div>

           {/* Right Column: Artifact Vault */}
           <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                 <h2 className="text-xl font-bold uppercase tracking-widest border-l-4 border-primary pl-3">Artifact Vault</h2>
                 <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <History className="w-3 h-3" />
                    Last Sync: {new Date().toLocaleTimeString()}
                 </div>
              </div>

              <div className="flex-1 min-h-[500px] flex flex-col gap-4">
                 {loading ? (
                   <div className="flex-1 flex items-center justify-center opacity-50">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mr-3" />
                      <p className="font-mono text-xs uppercase">Decoding Vault...</p>
                   </div>
                 ) : savedCodes.length === 0 ? (
                   <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl opacity-40">
                      <FileCode className="w-12 h-12 mb-4" />
                      <p className="font-mono text-sm max-w-[250px] text-center">No stored artifacts found in your current neural cluster.</p>
                   </div>
                 ) : (
                   <div className="grid grid-cols-1 gap-4 overflow-y-auto pr-2 no-scrollbar max-h-[700px]">
                      <AnimatePresence>
                         {savedCodes.map((code, idx) => (
                           <motion.div
                             key={idx}
                             initial={{ opacity: 0, y: 10 }}
                             animate={{ opacity: 1, y: 0 }}
                             className="glass-effect p-5 rounded-2xl border-white/5 group hover:border-primary/20 transition-all cursor-pointer"
                           >
                              <div className="flex justify-between items-start mb-3">
                                 <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-white/5 text-muted-foreground">
                                       <Code className="w-4 h-4" />
                                    </div>
                                    <div>
                                       <h3 className="font-bold text-sm leading-none">{code.fileName || "unnamed_artifact.js"}</h3>
                                       <p className="text-[10px] text-primary uppercase tracking-tighter mt-1 font-bold">{code.language || "Unknown Language"}</p>
                                    </div>
                                 </div>
                                 <span className="text-[10px] text-muted-foreground uppercase font-mono">{new Date(code.createdAt || Date.now()).toLocaleDateString()}</span>
                              </div>
                              
                              <div className="bg-black/60 p-4 rounded-xl border border-white/5 font-mono text-xs overflow-hidden max-h-32 group-hover:max-h-64 transition-all duration-300">
                                 <code className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                                    {code.code.slice(0, 300)}{code.code.length > 300 ? "..." : ""}
                                 </code>
                              </div>
                           </motion.div>
                         ))}
                      </AnimatePresence>
                   </div>
                 )}

                 <div className="mt-auto glass-effect p-4 rounded-2xl border-primary/20 bg-primary/5 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs">
                       <Globe className="w-4 h-4 text-primary" />
                       <span className="text-muted-foreground">Cloud Sync: <span className="text-green-400 font-bold uppercase tracking-tighter">Enabled</span></span>
                    </div>
                    <button className="text-[10px] font-bold uppercase text-primary hover:underline">Manage Storage</button>
                 </div>
              </div>
           </div>

        </div>

      </main>
    </div>
  );
}
