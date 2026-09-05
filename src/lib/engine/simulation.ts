import { Transaction } from "../data/demoTransactions";
import { runRecoveryAgent, AgentDecision } from "./recoveryAgent";
import { evaluatePolicy, PolicyResult } from "./policyGuardian";
import { calculateRecoveryProbability } from "./scoringEngine";

export type SimulationStage = 
  | "IDLE"
  | "DETECT"
  | "DIAGNOSE"
  | "PREDICT"
  | "DECIDE"
  | "GUARD"
  | "EXECUTE"
  | "VERIFY"
  | "COMPLETE";

export interface AuditEvent {
  id: string;
  txId: string;
  timestamp: string;
  message: string;
}

export interface SimulationResult {
  transaction: Transaction;
  decision: AgentDecision;
  policy: PolicyResult;
  recovered: boolean;
  events: AuditEvent[];
}

function createEvent(txId: string, message: string): AuditEvent {
  return {
    id: Math.random().toString(36).substring(7),
    txId,
    timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
    message,
  };
}

export function processTransaction(tx: Transaction): SimulationResult {
  const events: AuditEvent[] = [];
  
  events.push(createEvent(tx.id, "Payment failure detected"));
  events.push(createEvent(tx.id, "Transaction context loaded"));
  
  const decision = runRecoveryAgent(tx);
  events.push(createEvent(tx.id, `Failure classified: ${decision.diagnosis}`));
  events.push(createEvent(tx.id, `Recovery probability calculated: ${Math.round(decision.recovery_probability * 100)}%`));
  events.push(createEvent(tx.id, `Optimal intervention selected: ${decision.recommended_action}`));
  
  const policy = evaluatePolicy(tx, decision.recommended_action);
  
  if (policy.authorized) {
    events.push(createEvent(tx.id, "Policy Guardian approved action"));
  } else {
    events.push(createEvent(tx.id, `Policy Guardian intervened: ${policy.finalAction}`));
  }

  let recovered = false;
  if (policy.finalAction === "RETRY" || policy.finalAction === "PAYMENT_LINK") {
    // In simulation, we assume high probability actions succeed
    recovered = true;
    events.push(createEvent(tx.id, "Action executed"));
    events.push(createEvent(tx.id, "Payment recovered"));
  } else if (policy.finalAction === "HUMAN_APPROVAL") {
    events.push(createEvent(tx.id, "Escalated for human approval"));
  } else {
    events.push(createEvent(tx.id, "Recovery sequence stopped"));
  }

  return {
    transaction: {
      ...tx,
      recovery_probability: decision.recovery_probability,
      recommended_action: decision.recommended_action,
      policy_result: policy.authorized ? "APPROVED" : "BLOCKED",
      outcome: recovered ? "RECOVERED" : (policy.finalAction === "HUMAN_APPROVAL" ? "ESCALATED" : "STOPPED"),
      expected_value: decision.expected_value
    },
    decision,
    policy,
    recovered,
    events
  };
}

// Global state for the demo
let demoTransactions: Transaction[] = [];

export function setDemoTransactions(txs: Transaction[]) {
  demoTransactions = txs;
}

export function getDemoTransactions() {
  return demoTransactions;
}

export async function runFullSimulation(
  txs: Transaction[],
  onProgress: (stage: SimulationStage, completedCount: number, currentTx: Transaction | null) => void
): Promise<SimulationResult[]> {
  const results: SimulationResult[] = [];
  
  onProgress("DETECT", 0, null);
  await new Promise(resolve => setTimeout(resolve, 500));
  
  onProgress("DIAGNOSE", 0, null);
  await new Promise(resolve => setTimeout(resolve, 500));

  for (let i = 0; i < txs.length; i++) {
    const res = processTransaction(txs[i]);
    results.push(res);
  }

  onProgress("PREDICT", 0, null);
  await new Promise(resolve => setTimeout(resolve, 500));
  
  onProgress("DECIDE", 0, null);
  await new Promise(resolve => setTimeout(resolve, 500));
  
  onProgress("GUARD", 0, null);
  await new Promise(resolve => setTimeout(resolve, 500));
  
  onProgress("EXECUTE", 0, null);
  await new Promise(resolve => setTimeout(resolve, 500));
  
  onProgress("VERIFY", txs.length, null);
  await new Promise(resolve => setTimeout(resolve, 500));
  
  onProgress("COMPLETE", txs.length, null);
  
  return results;
}
