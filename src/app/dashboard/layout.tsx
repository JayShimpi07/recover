import Link from "next/link";
import { Activity, ShieldCheck, PlayCircle, BarChart3, List, ChevronRight } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 flex flex-col font-sans selection:bg-white/20">
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/60 backdrop-blur-xl">
        <div className="container flex h-14 items-center px-4 justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-white" />
              <span className="font-bold text-white tracking-tight">R.E.C.O.V.E.R.</span>
            </Link>
            
            <div className="hidden md:flex items-center text-sm space-x-6 text-zinc-400">
              <Link href="/dashboard" className="flex items-center text-white font-medium hover:text-white transition-colors">
                <BarChart3 className="mr-2 h-4 w-4" /> Overview
              </Link>
              <Link href="#" className="flex items-center hover:text-white transition-colors">
                <ShieldCheck className="mr-2 h-4 w-4" /> Policies
              </Link>
              <Link href="#" className="flex items-center hover:text-white transition-colors">
                <List className="mr-2 h-4 w-4" /> Audit
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-xs font-medium border border-white/10 rounded-full px-3 py-1 bg-white/5">
              <span className="glowing-dot" />
              <span className="text-zinc-200">AGENT ONLINE</span>
            </div>
            
            <div className="flex items-center space-x-2 text-xs font-medium border border-white/10 rounded-full px-3 py-1 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
              <span className="text-zinc-200">DEMO MODE</span>
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col relative">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
        
        <div className="relative z-10 p-6 max-w-[1600px] w-full mx-auto flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
