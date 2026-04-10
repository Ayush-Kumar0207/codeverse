"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Terminal, Cpu, Database, Command, Loader2 } from "lucide-react";

export default function DemoPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Initializing Core...");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const launchDemo = async () => {
      try {
        // Step 1: Simulated Boot Sequence
        const stages = [
          { msg: "Connecting to Edge Cluster...", p: 20 },
          { msg: "Mounting Virtual Filesystem...", p: 40 },
          { msg: "Injecting Sandbox Context...", p: 60 },
          { msg: "Synchronizing Real-Time Rails...", p: 80 },
          { msg: "System Ready. Redirecting...", p: 100 },
        ];

        for (const stage of stages) {
          await new Promise((r) => setTimeout(r, 200));
          setStatus(stage.msg);
          setProgress(stage.p);
        }

        // Step 2: Always boot local demo sandbox so Supabase/backend is optional
        router.replace("/editor/demo-sandbox?mode=demo");
      } catch (err) {
        console.error("Critical Boot Error:", err);
        setStatus("System Failure. Emergency Shutdown...");
        setTimeout(() => router.push("/"), 2000);
      }
    };

    launchDemo();
  }, [router]);

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden font-mono">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 noise-bg opacity-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] glow-orb opacity-10 pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg">
        {/* Boot Terminal Layout */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="glass-effect border border-primary/20 rounded-2xl p-8 bg-black/60 shadow-2xl overflow-hidden"
        >
          <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
            <div className="w-10 h-10 rounded bg-primary/10 border border-primary/20 flex items-center justify-center">
               <Command className="w-6 h-6 text-primary" />
            </div>
            <div>
               <h1 className="text-white text-lg font-black tracking-tighter">CODEVERSE_STAGING</h1>
               <p className="text-[10px] text-muted-foreground uppercase tracking-widest">v2.0.4 - Secure Sandbox Instance</p>
            </div>
          </div>

          <div className="space-y-6">
             <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold text-primary uppercase tracking-widest">
                   <span>{status}</span>
                   <span>{progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                   <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-primary"
                   />
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Cpu, label: "Neural Engine", status: "Active" },
                  { icon: Database, label: "Redis State", status: "Syncing" },
                  { icon: Terminal, label: "Tencent_RT", status: "Buffered" },
                  { icon: Loader2, label: "Project_G", status: "Pending" }
                ].map((item, i) => (
                  <div key={item.label} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                     <item.icon className={`w-4 h-4 ${i < (progress / 25) ? 'text-primary' : 'text-muted-foreground opacity-30 animate-pulse'}`} />
                     <div className="flex flex-col">
                        <span className="text-[9px] text-muted-foreground font-bold uppercase">{item.label}</span>
                        <span className="text-[8px] text-primary">{item.status}</span>
                     </div>
                  </div>
                ))}
             </div>

             <div className="text-[10px] text-muted-foreground/30 leading-relaxed font-mono opacity-50">
                {">"} sysctl -w net.core.wmem_max=16777216 <br />
                {">"} export CODEVERSE_ENV=demo_guest <br />
                {">"} ./bin/boot --room_type=collaboration
             </div>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
         @keyframes pulse {
           0% { opacity: 0.3; }
           50% { opacity: 0.7; }
           100% { opacity: 0.3; }
         }
      `}</style>
    </main>
  );
}
