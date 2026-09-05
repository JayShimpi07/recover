import { Transaction, RecoveryAction } from "../data/demoTransactions";

export interface PolicyCheck {
  id: string;
  label: string;
  passed: boolean;
  message?: string;
}

export interface PolicyResult {
  authorized: boolean;
  checks: PolicyCheck[];
  finalAction: RecoveryAction;
}

export function evaluatePolicy(tx: Transaction, recommendedAction: RecoveryAction): PolicyResult {
  const checks: PolicyCheck[] = [];
  let authorized = true;
  let finalAction = recommendedAction;

  // Rule 1: Consent
  const consentPass = tx.consent_status;
  checks.push({
    id: "consent",
    label: "Customer consent",
    passed: consentPass,
    message: consentPass ? undefined : "Customer opted out of communications"
  });
  if (!consentPass) {
    authorized = false;
    finalAction = "STOP";
  }

  // Rule 2: Retry Limit
  const retryPass = tx.attempt_count < 3;
  checks.push({
    id: "retry_limit",
    label: "Retry limit",
    passed: retryPass,
    message: retryPass ? undefined : "Max attempts (3) exceeded"
  });
  if (!retryPass) {
    authorized = false;
    finalAction = "STOP";
  }

  // Rule 3: Amount Threshold
  const amountPass = tx.amount <= 50000;
  checks.push({
    id: "amount_threshold",
    label: "Merchant threshold",
    passed: amountPass,
    message: amountPass ? undefined : "Amount > ₹50k requires human approval"
  });
  if (!amountPass) {
    authorized = false;
    finalAction = "HUMAN_APPROVAL";
  }

  // Rule 4: Risk Threshold
  const riskPass = (tx.recovery_probability || 0) >= 0.25;
  checks.push({
    id: "risk_threshold",
    label: "Risk threshold",
    passed: riskPass,
    message: riskPass ? undefined : "Probability < 0.25, recovery unlikely"
  });
  if (!riskPass) {
    authorized = false;
    finalAction = "STOP";
  }

  return {
    authorized,
    checks,
    finalAction
  };
}
