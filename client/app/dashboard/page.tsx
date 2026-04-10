"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getToken, removeToken } from "../../utils/auth";
import { useRouter } from "next/navigation";
import { fetchProfile } from "@/services/auth";
import { fetchProjectsByOwner } from "@/services/projects";
import type { SharedUser } from "@shared/types/user";
import type { SharedProject } from "@shared/types/project";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Code, 
  Activity, 
  Clock, 
  ChevronRight, 
  Terminal, 
  Zap,
  Layout,
  ExternalLink,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const [user, setUser] = useState<SharedUser | null>(null);
  const [projects, setProjects] = useState<SharedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) return router.push("/login");

    const initDashboard = async () => {
      try {
        const profileData = await fetchProfile();
        if (profileData.user) {
          setUser(profileData.user);
          const projectData = await fetchProjectsByOwner(profileData.user.username);
          setProjects(projectData.projects || []);
        } else {
          throw new Error("Invalid session");
        }
      } catch (err) {
        console.error("Dashboard init error:", err);
        removeToken();
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    initDashboard();
  }, [router]);

  if (loading || !user) {
    return (
      <div className="h-screen w-full bg-background flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground font-mono animate-pulse">Initializing Command Center...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center">
      {/* Ambient Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] glow-orb opacity-50 select-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] glow-orb-secondary opacity-30 select-none" />

      <main className="w-full max-w-7xl px-8 py-12 relative z-10 flex flex-col gap-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-black font-outfit uppercase tracking-tighter">
              Control <span className="text-primary italic">Center</span>
            </h1>
            <p className="text-muted-foreground text-lg mt-2 font-inter max-w-xl">
              Welcome back, <span className="text-white font-semibold">{user.username}</span>. Your workspace is synchronized and ready for deployment.
            </p>
          </div>
          <button 
            onClick={() => {}}
            className="flex items-center gap-2 bg-primary px-6 py-3 rounded-xl font-bold text-white shadow-xl shadow-primary/20 hover:scale-105 transition-all text-sm uppercase tracking-widest active:scale-95"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </motion.div>

        {/* Bento Grid Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           {[
             { label: "Active Projects", val: projects.length, icon: Layout, color: "text-blue-400" },
             { label: "Stability Index", val: "99.9%", icon: Activity, color: "text-green-400" },
             { label: "Runtime Tokens", val: "1,248", icon: Zap, color: "text-yellow-400" },
           ].map((stat, i) => (
             <motion.div 
               key={stat.label}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 + 0.2 }}
               className="glass-effect p-6 rounded-2xl border-white/5 flex items-center justify-between"
             >
               <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
                  <p className={cn("text-3xl font-black font-outfit", stat.color)}>{stat.val}</p>
               </div>
               <stat.icon className={cn("w-10 h-10 opacity-20", stat.color)} />
             </motion.div>
           ))}
        </div>

        {/* Main Content Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Project Browser */}
           <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                 <h2 className="text-xl font-bold uppercase tracking-widest border-l-4 border-primary pl-3">Project Browser</h2>
                 <Link href="#" className="text-xs text-primary hover:underline">View All Projects</Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <AnimatePresence mode="popLayout">
                    {projects.length > 0 ? (
                      projects.map((proj, i) => (
                        <motion.div
                          key={proj._id || i}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ y: -5 }}
                          className="glass-effect rounded-2xl border-white/5 p-5 group cursor-pointer"
                          onClick={() => router.push(`/editor/${proj._id || "demo"}`)}
                        >
                           <div className="flex justify-between items-start mb-4">
                              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                 <Code className="w-5 h-5" />
                              </div>
                              <span className="text-[10px] bg-white/5 px-2 py-1 rounded-full text-muted-foreground uppercase font-bold tracking-tighter">
                                 {proj.language}
                              </span>
                           </div>
                           <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{proj.title}</h3>
                           <p className="text-xs text-muted-foreground mb-6 line-clamp-1">Last synchronized at {new Date(proj.updatedAt || Date.now()).toLocaleDateString()}</p>
                           
                           <div className="flex items-center justify-between pt-4 border-t border-white/5">
                              <div className="flex -space-x-1">
                                {[1,2].map(x => <div key={x} className="w-5 h-5 rounded-full border border-background bg-slate-800" />)}
                              </div>
                              <ChevronRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                           </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="col-span-2 py-20 flex flex-col items-center justify-center glass-effect rounded-2xl border-dashed border-white/10 opacity-50">
                         <Layout className="w-12 h-12 mb-4 text-muted-foreground" />
                         <p className="font-mono text-center px-10">Critical: No neural workspaces detected. Initialize your first project to begin execution.</p>
                      </div>
                    )}
                 </AnimatePresence>
              </div>
           </div>

           {/* Activity Feed */}
           <div className="flex flex-col gap-6">
              <h2 className="text-xl font-bold uppercase tracking-widest border-l-4 border-accent pl-3">Neural Log</h2>
              <div className="glass-effect rounded-2xl border-white/5 p-6 flex-1 flex flex-col gap-6 overflow-hidden max-h-[600px]">
                 {[
                    { type: "EXEC", msg: "Initialized sandbox_layer_7", time: "2m ago", color: "text-blue-400" },
                    { type: "SYNC", msg: "Supabase connection active", time: "12m ago", color: "text-green-400" },
                    { type: "AUTH", msg: "Session refreshed successfully", time: "1h ago", color: "text-primary" },
                    { type: "ERR", msg: "Memory leak detected in PTY bridge", time: "3h ago", color: "text-red-400" },
                 ].map((log, i) => (
                    <div key={i} className="flex gap-4 items-start">
                       <div className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded border border-current bg-current/5 w-12 text-center shrink-0", log.color)}>
                          {log.type}
                       </div>
                       <div className="flex flex-col">
                          <p className="text-[13px] text-foreground leading-tight">{log.msg}</p>
                          <p className="text-[10px] font-mono text-muted-foreground uppercase mt-1">{log.time}</p>
                       </div>
                    </div>
                 ))}
                 
                 <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-muted-foreground">
                    <div className="flex items-center gap-2 text-xs">
                       <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                       Node Bridge: Active
                    </div>
                    <Terminal className="w-4 h-4" />
                 </div>
              </div>
           </div>

        </div>

        {/* Quick Footer Action */}
        <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-6 px-4 py-8 rounded-2xl border border-primary/20 bg-primary/5">
           <div>
              <h3 className="font-bold flex items-center gap-2">
                 <Zap className="w-4 h-4 text-yellow-400" />
                 Accelerate your workflow
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Connect your GitHub account to enable continuous integration and live deployments.</p>
           </div>
           <button className="whitespace-nowrap bg-white text-black px-6 py-2 rounded-lg font-bold text-sm hover:bg-slate-200 transition-colors">
              Connect Repository
           </button>
        </div>

      </main>
      
      {/* Background Decor */}
      <div className="fixed inset-0 noise-bg pointer-events-none opacity-20" />
    </div>
  );
}
