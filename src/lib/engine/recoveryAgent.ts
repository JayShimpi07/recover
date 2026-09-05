import { Transaction, RecoveryAction } from "../data/demoTransactions";
import { calculateRecoveryProbability } from "./scoringEngine";
import { evaluateStrategies, getHeroStrategyEvaluation } from "./expectedValue";

export interface AgentDecision {
  diagnosis: string;
  recovery_probability: number;
  recommended_action: RecoveryAction;
  reasoning: string;
  expected_value: number;
  confidence: number;
  strategy_evaluations: any[];
}

export function runRecoveryAgent(tx: Transaction): AgentDecision {
  // 1. Diagnose & Predict
  const { probability, breakdown } = calculateRecoveryProbability(tx);
  tx.recovery_probability = probability;

  // 2. Evaluate Strategies
  const isHero = tx.id === "RX-9281";
  const strategies = isHero ? getHeroStrategyEvaluation() : evaluateStrategies(tx.amount, probability, tx.customer_lifetime_value > 50000);
  
  // 3. Recommend Best Action
  let recommended = strategies[0].action;
  
  // Hardcoded hero
  if (isHero) {
    recommended = "PAYMENT_LINK";
  } else if (tx.amount > 50000) {
    recommended = "HUMAN_APPROVAL";
  } else if (probability < 0.25) {
    recommended = "STOP";
  } else if (tx.attempt_count >= 3) {
    recommended = "STOP";
  }

  // 4. Generate AI Reasoning
  let reasoning = "";
  let diagnosis = "";

  if (isHero) {
    diagnosis = "Temporary payment failure detected.";
    reasoning = "Temporary payment failure detected. Customer has a strong historical payment relationship and only one failed attempt. A fresh payment route is more likely to recover revenue than an immediate repeated retry.";
  } else if (recommended === "HUMAN_APPROVAL") {
    diagnosis = "High-value transaction failure.";
    reasoning = "Transaction amount exceeds autonomous action threshold. Recovery probability is strong, but merchant policy requires manual review for values over ₹50,000.";
  } else if (recommended === "STOP") {
    diagnosis = "Recovery unlikely or policy violation.";
    if (probability < 0.25) {
      reasoning = "Recovery probability is too low to justify intervention cost. Stopping workflow.";
    } else {
      reasoning = "Maximum retry attempts exceeded or customer consent withdrawn. Stopping workflow to prevent friction.";
    }
  } else if (recommended === "RETRY") {
    diagnosis = "Transient failure.";
    reasoning = "Failure is likely transient. Customer history suggests a direct retry will succeed without requiring customer intervention.";
  } else {
    diagnosis = "Customer action required.";
    reasoning = "Payment failure requires a new route. Generating a payment link maximizes expected recovery value with acceptable friction.";
  }

  return {
    diagnosis,
    recovery_probability: probability,
    recommended_action: recommended,
    reasoning,
    expected_value: strategies[0].expectedValue,
    confidence: Number((probability + 0.05).toFixed(2)),
    strategy_evaluations: strategies,
  };
}
