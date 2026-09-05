import { RecoveryAction } from "../data/demoTransactions";

export interface StrategyEvaluation {
  action: RecoveryAction;
  expectedValue: number;
  probability: number;
  cost: number;
}

export function evaluateStrategies(amount: number, baseProbability: number, isHighValue: boolean): StrategyEvaluation[] {
  // Define base costs
  const costs: Record<RecoveryAction, number> = {
    RETRY: 180, // API cost + network fees + friction
    PAYMENT_LINK: 50, // SMS/Email cost
    RECOVERY_MESSAGE: 20,
    WAIT: 0,
    HUMAN_APPROVAL: 500, // Agent time cost
    STOP: 0,
  };

  // Adjust probabilities based on action type
  const evals: StrategyEvaluation[] = [];

  // 1. Retry
  let retryProb = baseProbability - 0.13; // Lower probability for blind retry
  if (retryProb < 0) retryProb = 0;
  evals.push({
    action: "RETRY",
    probability: Number(retryProb.toFixed(2)),
    expectedValue: Math.round((amount * retryProb) - costs["RETRY"]),
    cost: costs["RETRY"],
  });

  // 2. Payment Link
  let linkProb = baseProbability; // Base probability is tuned for payment links
  evals.push({
    action: "PAYMENT_LINK",
    probability: Number(linkProb.toFixed(2)),
    expectedValue: Math.round((amount * linkProb) - costs["PAYMENT_LINK"]),
    cost: costs["PAYMENT_LINK"],
  });

  // 3. Wait
  let waitProb = baseProbability - 0.29; // Waiting lowers probability significantly
  if (waitProb < 0) waitProb = 0.05;
  evals.push({
    action: "WAIT",
    probability: Number(waitProb.toFixed(2)),
    expectedValue: Math.round((amount * waitProb) - costs["WAIT"]),
    cost: costs["WAIT"],
  });

  // 4. Message
  let msgProb = baseProbability - 0.17; 
  if (msgProb < 0) msgProb = 0.1;
  evals.push({
    action: "RECOVERY_MESSAGE",
    probability: Number(msgProb.toFixed(2)),
    expectedValue: Math.round((amount * msgProb) - costs["RECOVERY_MESSAGE"]),
    cost: costs["RECOVERY_MESSAGE"],
  });

  return evals.sort((a, b) => b.expectedValue - a.expectedValue);
}

// Special overrides for "Why Not Retry" demo
export function getHeroStrategyEvaluation(): StrategyEvaluation[] {
  return [
    { action: "RETRY" as RecoveryAction, expectedValue: 3900, probability: 0.78, cost: 180 },
    { action: "PAYMENT_LINK" as RecoveryAction, expectedValue: 4499, probability: 0.91, cost: 50 },
    { action: "RECOVERY_MESSAGE" as RecoveryAction, expectedValue: 3700, probability: 0.74, cost: 20 },
    { action: "WAIT" as RecoveryAction, expectedValue: 3100, probability: 0.62, cost: 0 },
  ].sort((a, b) => b.expectedValue - a.expectedValue);
}
