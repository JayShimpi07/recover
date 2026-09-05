import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PlayCircle, Cpu, Loader2, CheckCircle2 } from "lucide-react";
import { SimulationStage } from "@/lib/engine/simulation";
import { motion } from "framer-motion";

export function AgentPanel({ 
  stage, 
  progress, 
  isActive, 
  onRunSimulation 
}: { 
  stage: SimulationStage;
  progress: number;
  isActive: boolean;
  onRunSimulation: () => void;
}) {
  
  const pipeline = [
    { id: "DETECT", label: "DETECT" },
    { id: "DIAGNOSE", label: "DIAGNOSE" },
    { id: "PREDICT", label: "PREDICT" },
    { id: "DECIDE", label: "DECIDE" },
    { id: "GUARD", label: "GUARD" },
    { id: "EXECUTE", label: "EXECUTE" },
    { id: "VERIFY", label: "VERIFY" }
  ];

  return (
    <Card className="h-full flex flex-col bg-black/40 border-zinc-800 backdrop-blur-md">
      <CardHeader className="border-b border-white/5 pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <Cpu className="h-5 w-5 text-emerald-400" /> RECOVERY AGENT
          </CardTitle>
          <div className="flex items-center space-x-2 text-xs font-medium border border-emerald-900/50 rounded-full px-2.5 py-0.5 bg-emerald-900/20 text-emerald-400">
            <span className={isActive ? "glowing-dot" : "h-2 w-2 rounded-full bg-emerald-500"} />
            <span>{isActive ? "PROCESSING" : "AUTONOMOUS"}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-6 flex flex-col space-y-8 justify-between">
        <div className="space-y-6">
          {!isActive && stage !== "COMPLETE" && (
            <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
              <p className="text-zinc-400 text-sm">Agent is idle. 100 failed transactions waiting in queue.</p>
              <Button onClick={onRunSimulation} size="lg" className="w-full bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]">
                <PlayCircle className="mr-2 h-5 w-5" />
                RUN RECOVERY SIMULATION
              </Button>
            </div>
          )}

          {isActive && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex justify-between text-sm">
                <span className="text-white font-medium flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin text-emerald-500" />
                  PROCESSING 100 FAILED PAYMENTS
                </span>
                <span className="text-zinc-400">{progress}%</span>
              </div>
              <Progress value={progress} className="h-1" />
              
              <div className="space-y-3 pt-4 border-t border-white/5">
                {pipeline.map((step) => {
                  const isActiveStep = stage === step.id;
                  const isPastStep = pipeline.findIndex(s => s.id === step.id) < pipeline.findIndex(s => s.id === stage) || stage === "COMPLETE";
                  
                  return (
                    <div key={step.id} className="flex items-center gap-3 transition-all duration-300">
                      {isPastStep ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      ) : (
                        <div className={`h-3 w-3 rounded-full flex-shrink-0 ml-0.5 ${
                          isActiveStep ? "bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" : 
                          "bg-zinc-800 border border-zinc-700"
                        }`} />
                      )}
                      <span className={`text-sm font-medium tracking-wide ${
                        isActiveStep ? "text-white" : 
                        isPastStep ? "text-emerald-400/70" : "text-zinc-700"
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {stage === "COMPLETE" && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center text-center py-12 space-y-4"
            >
              <div className="h-16 w-16 rounded-full bg-emerald-900/30 flex items-center justify-center mb-4">
                <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.6)]">
                  <div className="h-3 w-3 bg-white rotate-45 transform translate-y-[-1px] -translate-x-[2px] skew-y-12" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white">RECOVERY COMPLETE</h3>
              <p className="text-zinc-400 text-sm">All operations executed under Policy Guardian constraints.</p>
              <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
                Reset Simulation
              </Button>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
