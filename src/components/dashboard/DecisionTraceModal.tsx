import React, { useState, useEffect } from "react";
import { Transaction } from "@/lib/data/demoTransactions";
import { SimulationResult } from "@/lib/engine/simulation";
import { runRecoveryAgent } from "@/lib/engine/recoveryAgent";
import { evaluatePolicy } from "@/lib/engine/policyGuardian";
import { calculateRecoveryProbability } from "@/lib/engine/scoringEngine";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { X, CheckCircle2, XCircle, FileText, AlertTriangle, ChevronRight, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function DecisionTraceModal({ 
  isOpen, 
  onClose, 
  transaction,
  result: passedResult 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  transaction: Transaction;
  result?: SimulationResult;
}) {
  const [showWhyNotRetry, setShowWhyNotRetry] = useState(false);
  const [typedReasoning, setTypedReasoning] = useState("");
  
  // If result is not passed (not simulated yet), we compute it on the fly for the trace
  const decision = passedResult?.decision || runRecoveryAgent(transaction);
  const policy = passedResult?.policy || evaluatePolicy(transaction, decision.recommended_action);
  const { breakdown } = calculateRecoveryProbability(transaction);
  
  const isHighValue = transaction.amount > 50000;
  
  // Typewriter effect for AI Reasoning
  useEffect(() => {
    if (isOpen && decision.reasoning) {
      setTypedReasoning("");
      let i = 0;
      const interval = setInterval(() => {
        setTypedReasoning(decision.reasoning.substring(0, i));
        i++;
        if (i > decision.reasoning.length) clearInterval(interval);
      }, 15);
      return () => clearInterval(interval);
    }
  }, [isOpen, decision.reasoning]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0a0a0c] border border-zinc-800 rounded-xl shadow-2xl flex flex-col custom-scrollbar"
      >
        {/* Header */}
        <div className="sticky top-0 z-20 flex justify-between items-center p-6 border-b border-white/5 bg-[#0a0a0c]/90 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded bg-white/5 flex items-center justify-center border border-white/10">
              <Activity className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white leading-none">AGENT DECISION TRACE</h2>
              <p className="text-zinc-500 text-xs mt-1 font-mono">PAYMENT #{transaction.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 pb-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: Context & Probability */}
          <div className="space-y-8">
            <section>
              <h3 className="text-xs font-semibold text-zinc-500 tracking-wider mb-4">TRANSACTION CONTEXT</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Customer</span>
                  <span className="text-white font-medium">{transaction.customer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Amount</span>
                  <span className="text-white font-medium">{formatCurrency(transaction.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Failure</span>
                  <span className="text-zinc-300">{transaction.failure_type.replace(/_/g, " ")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Attempts</span>
                  <span className="text-zinc-300">{transaction.attempt_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">LTV</span>
                  <span className="text-emerald-400">{formatCurrency(transaction.customer_lifetime_value)}</span>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xs font-semibold text-zinc-500 tracking-wider mb-4">RECOVERY PROBABILITY</h3>
              <div className="text-4xl font-light text-white mb-6 flex items-baseline whitespace-nowrap">
                {Math.round(decision.recovery_probability * 100)}%
              </div>
              
              <div className="space-y-3">
                {breakdown.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-400">{item.label}</span>
                      <span className={item.score > 0 ? "text-emerald-400" : item.score < 0 ? "text-red-400" : "text-zinc-500"}>
                        {item.score > 0 ? "+" : ""}{item.score}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.score > 0 ? "bg-emerald-500/50" : "bg-red-500/50"}`} 
                        style={{ width: `${Math.min(100, (Math.abs(item.score) / item.max) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Middle/Right Column: Reasoning, Strategy & Policy */}
          <div className="md:col-span-2 space-y-8">
            
            <AnimatePresence mode="wait">
              {!showWhyNotRetry ? (
                <motion.div 
                  key="main-trace"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8"
                >
                  <section>
                    <h3 className="text-xs font-semibold text-zinc-500 tracking-wider mb-3">AI REASONING</h3>
                    <div className="bg-white/[0.02] border border-white/5 p-4 rounded-lg">
                      <p className="text-sm text-zinc-300 leading-relaxed font-mono">
                        {typedReasoning}
                        <span className="animate-pulse bg-white/50 w-2 h-4 inline-block ml-1 align-middle" />
                      </p>
                    </div>
                  </section>

                  <section>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-xs font-semibold text-zinc-500 tracking-wider">RECOMMENDED ACTION</h3>
                      {decision.recommended_action !== "RETRY" && decision.recommended_action !== "STOP" && (
                        <button 
                          onClick={() => setShowWhyNotRetry(true)}
                          className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors flex items-center"
                        >
                          WHY NOT RETRY? <ChevronRight className="h-3 w-3 ml-1" />
                        </button>
                      )}
                    </div>
                    
                    <div className="bg-emerald-950/20 border border-emerald-900/50 p-4 rounded-lg flex justify-between items-center">
                      <span className="font-semibold text-emerald-400 tracking-wider">
                        {decision.recommended_action.replace(/_/g, " ")}
                      </span>
                      <span className="text-xs text-emerald-500 font-mono">
                        EXPECTED VALUE: {formatCurrency(decision.expected_value)}
                      </span>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xs font-semibold text-zinc-500 tracking-wider mb-3">POLICY GUARDIAN</h3>
                    <div className="space-y-2 bg-black/40 border border-white/5 p-4 rounded-lg">
                      {policy.checks.map(check => (
                        <div key={check.id} className="flex items-center gap-3">
                          {check.passed ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                          )}
                          <span className={`text-sm ${check.passed ? "text-zinc-300" : "text-red-400 font-medium"}`}>
                            {check.label}
                          </span>
                          {!check.passed && check.message && (
                            <span className="text-xs text-red-500/70 ml-auto">{check.message}</span>
                          )}
                        </div>
                      ))}
                      
                      <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                        <span className="text-sm font-medium text-white">Authorization Status:</span>
                        {policy.authorized ? (
                          <Badge variant="success">ACTION AUTHORIZED</Badge>
                        ) : (
                          <Badge variant={policy.finalAction === "HUMAN_APPROVAL" ? "secondary" : "destructive"}>
                            {policy.finalAction === "HUMAN_APPROVAL" ? "HUMAN APPROVAL REQUIRED" : "ACTION BLOCKED"}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </section>

                  {/* Outcome display */}
                  <div className="pt-4 flex justify-between items-center border-t border-white/10">
                    <div className="text-xs text-zinc-500">FINAL RESULT</div>
                    <div className="text-2xl font-semibold text-white">
                      {policy.finalAction === "PAYMENT_LINK" || policy.finalAction === "RETRY" ? (
                        <span className="text-emerald-400">{formatCurrency(transaction.amount)} RECOVERED</span>
                      ) : policy.finalAction === "HUMAN_APPROVAL" ? (
                        <span className="text-amber-400">AWAITING APPROVAL</span>
                      ) : (
                        <span className="text-zinc-500">0 RECOVERED</span>
                      )}
                    </div>
                  </div>
                  
                  {isHighValue && policy.finalAction === "HUMAN_APPROVAL" && (
                    <div className="flex gap-4 pt-2">
                      <Button className="flex-1 bg-white text-black hover:bg-zinc-200">APPROVE INTERVENTION</Button>
                      <Button variant="outline" className="flex-1">REJECT</Button>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  key="why-not-retry"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <button 
                    onClick={() => setShowWhyNotRetry(false)}
                    className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center mb-6"
                  >
                    ← BACK TO DECISION TRACE
                  </button>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Strategy Evaluation Matrix</h3>
                    <p className="text-sm text-zinc-400">
                      The agent optimizes for Expected Recovered Revenue, accounting for intervention costs and probability of success.
                    </p>
                  </div>

                  <div className="bg-[#0a0a0c] border border-white/10 rounded-xl overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-white/5 text-xs text-zinc-400">
                        <tr>
                          <th className="px-4 py-3 font-medium">STRATEGY</th>
                          <th className="px-4 py-3 font-medium text-right">PROBABILITY</th>
                          <th className="px-4 py-3 font-medium text-right">COST</th>
                          <th className="px-4 py-3 font-medium text-right">EXPECTED VALUE</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {decision.strategy_evaluations.map((strat, idx) => {
                          const isSelected = strat.action === decision.recommended_action;
                          return (
                            <tr key={idx} className={isSelected ? "bg-emerald-900/10" : ""}>
                              <td className="px-4 py-3 font-medium flex items-center gap-2">
                                {isSelected && <Activity className="h-3 w-3 text-emerald-500" />}
                                <span className={isSelected ? "text-emerald-400" : "text-zinc-300"}>
                                  {strat.action.replace(/_/g, " ")}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right text-zinc-400">
                                {Math.round(strat.probability * 100)}%
                              </td>
                              <td className="px-4 py-3 text-right text-red-400/80">
                                -{formatCurrency(strat.cost)}
                              </td>
                              <td className={`px-4 py-3 text-right font-medium ${isSelected ? "text-emerald-400" : "text-zinc-300"}`}>
                                {formatCurrency(strat.expectedValue)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-4 rounded-lg space-y-4">
                    <h4 className="text-sm font-medium text-white flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-400" />
                      Cost of Retry Analysis
                    </h4>
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      While a direct RETRY requires zero customer effort, its success probability for {transaction.failure_type.replace(/_/g, " ")} is significantly lower than alternative routes. When factoring in the {formatCurrency(180)} friction and processing cost penalty, {decision.recommended_action.replace(/_/g, " ")} mathematically dominates the expected value outcome.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
