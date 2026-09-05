export type FailureType =
  | "TEMPORARY_BANK_ERROR"
  | "UPI_TIMEOUT"
  | "CARD_DECLINED"
  | "INSUFFICIENT_FUNDS"
  | "AUTHENTICATION_FAILURE"
  | "NETWORK_ERROR"
  | "EXPIRED_CARD"
  | "UNKNOWN_FAILURE";

export type RecoveryAction =
  | "RETRY"
  | "PAYMENT_LINK"
  | "RECOVERY_MESSAGE"
  | "WAIT"
  | "HUMAN_APPROVAL"
  | "STOP";

export interface Transaction {
  id: string;
  customer: string;
  amount: number;
  payment_method: string;
  failure_type: FailureType;
  attempt_count: number;
  previous_successes: number;
  customer_lifetime_value: number;
  last_payment_days: number;
  consent_status: boolean;
  // Computed fields
  recovery_probability?: number;
  recommended_action?: RecoveryAction;
  policy_result?: string;
  outcome?: string;
  expected_value?: number;
}

// Deterministic simple random generator for seeded data
export class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  nextItem<T>(array: T[]): T {
    return array[this.nextInt(0, array.length - 1)];
  }
}

const FIRST_NAMES = ["Rahul", "Aarav", "Priya", "Vikram", "Sneha", "Aditya", "Neha", "Rohan", "Kavya", "Aryan", "Meera", "Karan", "Anjali", "Siddharth", "Pooja"];
const LAST_NAMES = ["Mehta", "Shah", "Nair", "Joshi", "Patel", "Sharma", "Singh", "Kumar", "Gupta", "Desai", "Rao", "Reddy", "Iyer", "Das", "Verma"];
const FAILURE_TYPES: FailureType[] = ["TEMPORARY_BANK_ERROR", "UPI_TIMEOUT", "CARD_DECLINED", "INSUFFICIENT_FUNDS", "AUTHENTICATION_FAILURE", "NETWORK_ERROR", "EXPIRED_CARD", "UNKNOWN_FAILURE"];
const PAYMENT_METHODS = ["UPI", "CREDIT_CARD", "DEBIT_CARD", "NET_BANKING", "WALLET"];

export function generateMockTransactions(count: number = 100): Transaction[] {
  const rng = new SeededRandom(12345);
  const transactions: Transaction[] = [];

  for (let i = 0; i < count; i++) {
    const isHighValue = rng.next() > 0.95; // 5% chance of > 50k
    
    // Amounts: usually 500 to 20000. If high value, 50000 to 100000
    const amount = isHighValue 
      ? rng.nextInt(50000, 95000)
      : rng.nextInt(500, 25000);
      
    // Failure type based on method
    const paymentMethod = rng.nextItem(PAYMENT_METHODS);
    let failureType = rng.nextItem(FAILURE_TYPES);
    
    if (paymentMethod === "UPI") {
      failureType = rng.nextItem(["UPI_TIMEOUT", "NETWORK_ERROR", "TEMPORARY_BANK_ERROR", "INSUFFICIENT_FUNDS"]);
    } else if (paymentMethod === "CREDIT_CARD" || paymentMethod === "DEBIT_CARD") {
      failureType = rng.nextItem(["CARD_DECLINED", "EXPIRED_CARD", "AUTHENTICATION_FAILURE", "INSUFFICIENT_FUNDS", "NETWORK_ERROR"]);
    }

    const previousSuccesses = rng.nextInt(0, 50);
    
    transactions.push({
      id: `RX-${9000 + i}`,
      customer: `${rng.nextItem(FIRST_NAMES)} ${rng.nextItem(LAST_NAMES)}`,
      amount,
      payment_method: paymentMethod,
      failure_type: failureType,
      attempt_count: rng.nextInt(1, 4),
      previous_successes: previousSuccesses,
      customer_lifetime_value: rng.nextInt(1000, 200000) + (previousSuccesses * 1500),
      last_payment_days: rng.nextInt(1, 90),
      consent_status: rng.next() > 0.1, // 90% consented
    });
  }

  // Ensure there's a specific high-value one we can use for the demo
  transactions[27] = {
    ...transactions[27],
    id: "RX-9284",
    customer: "Vikram Joshi",
    amount: 72000,
    payment_method: "CREDIT_CARD",
    failure_type: "CARD_DECLINED",
    attempt_count: 1,
    previous_successes: 45,
    customer_lifetime_value: 450000,
    consent_status: true,
  };

  // Ensure there's the specific hero transaction from the prompt
  transactions[0] = {
    ...transactions[0],
    id: "RX-9281",
    customer: "Rahul Mehta",
    amount: 4999,
    payment_method: "UPI",
    failure_type: "UPI_TIMEOUT",
    attempt_count: 1,
    previous_successes: 8,
    customer_lifetime_value: 42300,
    consent_status: true,
  };

  return transactions;
}
