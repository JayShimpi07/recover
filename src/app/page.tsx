import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Activity } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black min-h-screen relative overflow-hidden">
      
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-3xl">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
          <span className="glowing-dot" />
          <span className="text-xs font-medium text-zinc-300 tracking-wider">SYSTEM ONLINE</span>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter">
            R.E.C.O.V.E.R.
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 font-light tracking-wide">
            AUTONOMOUS REVENUE RECOVERY
          </p>
        </div>
        
        <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-zinc-500 to-transparent my-8" />
        
        <p className="text-2xl md:text-3xl font-medium text-white max-w-2xl leading-relaxed">
          "Every failed payment is a decision."
        </p>
        
        <div className="pt-12">
          <Link href="/dashboard">
            <Button size="lg" className="h-14 px-8 text-lg group bg-white text-black hover:bg-zinc-200 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
              <Activity className="mr-2 h-5 w-5" />
              LAUNCH RECOVERY AGENT
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
