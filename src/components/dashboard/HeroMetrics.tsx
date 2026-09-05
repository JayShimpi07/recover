import React, { useEffect, useState } from "react";
import { Transaction } from "@/lib/data/demoTransactions";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";

export function HeroMetrics({ 
  transactions, 
  simulationComplete 
}: { 
  transactions: Transaction[], 
  simulationComplete: boolean 
}) {
  const [displayMetrics, setDisplayMetrics] = useState({
    atRisk: 384700,
    recovered: 0,
    rate: 0,
    count: 0
  });

  // Calculate actual totals
  const totalAtRisk = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const recoveredAmount = simulationComplete ? 271400 : 0; // Hardcoded for demo story
  const recoveryRate = simulationComplete ? 70.5 : 0;
  const recoveredCount = simulationComplete ? 68 : 0;

  useEffect(() => {
    // For demo purposes, we'll snap to the exact numbers from the prompt to match the story perfectly
    if (simulationComplete) {
      setDisplayMetrics({
        atRisk: 384700,
        recovered: 271400,
        rate: 70.5,
        count: 68
      });
    } else {
      setDisplayMetrics({
        atRisk: 384700,
        recovered: 0,
        rate: 0,
        count: 0
      });
    }
  }, [simulationComplete]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-black/60 border-zinc-800">
        <CardContent className="p-6">
          <p className="text-sm font-medium text-zinc-400 mb-1">REVENUE AT RISK</p>
          <motion.div 
            key={displayMetrics.atRisk}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-semibold tracking-tight text-white"
          >
            {formatCurrency(displayMetrics.atRisk)}
          </motion.div>
        </CardContent>
      </Card>
      
      <Card className="bg-black/60 border-zinc-800 border-l-4 border-l-emerald-500">
        <CardContent className="p-6">
          <p className="text-sm font-medium text-emerald-400 mb-1">RECOVERED</p>
          <motion.div 
            key={displayMetrics.recovered}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-3xl font-semibold tracking-tight text-white"
          >
            {formatCurrency(displayMetrics.recovered)}
          </motion.div>
        </CardContent>
      </Card>

      <Card className="bg-black/60 border-zinc-800">
        <CardContent className="p-6">
          <p className="text-sm font-medium text-zinc-400 mb-1">RECOVERY RATE</p>
          <motion.div 
            key={displayMetrics.rate}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-3xl font-semibold tracking-tight text-white whitespace-nowrap flex items-baseline"
          >
            {displayMetrics.rate.toFixed(1)}%
          </motion.div>
        </CardContent>
      </Card>

      <Card className="bg-black/60 border-zinc-800">
        <CardContent className="p-6">
          <p className="text-sm font-medium text-zinc-400 mb-1">PAYMENTS RECOVERED</p>
          <motion.div 
            key={displayMetrics.count}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-3xl font-semibold tracking-tight text-white"
          >
            {displayMetrics.count}
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}
