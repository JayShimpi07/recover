"use client";

import React, { useState, useEffect } from "react";
import { generateMockTransactions, Transaction } from "@/lib/data/demoTransactions";
import { runFullSimulation, SimulationStage, SimulationResult, setDemoTransactions } from "@/lib/engine/simulation";
import { HeroMetrics } from "@/components/dashboard/HeroMetrics";
import { AgentPanel } from "@/components/dashboard/AgentPanel";
import { TransactionTable } from "@/components/dashboard/TransactionTable";
import { DecisionTraceModal } from "@/components/dashboard/DecisionTraceModal";

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [simulationActive, setSimulationActive] = useState(false);
  const [simulationStage, setSimulationStage] = useState<SimulationStage>("IDLE");
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [simulationResults, setSimulationResults] = useState<SimulationResult[]>([]);
  
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [traceModalOpen, setTraceModalOpen] = useState(false);

  // Initialize data
  useEffect(() => {
    const mockData = generateMockTransactions(100);
    setTransactions(mockData);
    setDemoTransactions(mockData);
  }, []);

  const handleRunSimulation = async () => {
    setSimulationActive(true);
    setSimulationStage("DETECT");
    setSimulationProgress(0);
    
    // Reset previous results
    setSimulationResults([]);
    
    const results = await runFullSimulation(transactions, (stage, completed, tx) => {
      setSimulationStage(stage);
      if (stage === "VERIFY" || stage === "COMPLETE") {
        setSimulationProgress(100);
      } else {
        // Just fake progress for visual effect during stages
        setSimulationProgress(prev => Math.min(prev + 10, 90));
      }
    });

    setSimulationResults(results);
    setSimulationStage("COMPLETE");
    setSimulationProgress(100);
    
    // Update transactions with their final states
    setTransactions(results.map(r => r.transaction));
  };

  const handleRowClick = (tx: Transaction) => {
    setSelectedTx(tx);
    setTraceModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Recovery Operations</h2>
          <p className="text-zinc-400 mt-1">Autonomous evaluation and intervention engine.</p>
        </div>
      </div>

      <HeroMetrics 
        transactions={transactions} 
        simulationComplete={simulationStage === "COMPLETE"} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AgentPanel 
            stage={simulationStage} 
            progress={simulationProgress} 
            isActive={simulationActive}
            onRunSimulation={handleRunSimulation}
          />
        </div>
        
        <div className="lg:col-span-2">
          <TransactionTable 
            transactions={transactions} 
            onRowClick={handleRowClick}
            results={simulationResults}
          />
        </div>
      </div>

      {selectedTx && (
        <DecisionTraceModal
          isOpen={traceModalOpen}
          onClose={() => setTraceModalOpen(false)}
          transaction={selectedTx}
          result={simulationResults.find(r => r.transaction.id === selectedTx.id)}
        />
      )}
    </div>
  );
}
