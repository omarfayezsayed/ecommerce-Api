import { OrderStatus, PaymentMethod } from "../../models/order";

export interface PaymentStrategy {
  getPaymentDecision(): {
    isPaid: boolean;
    paymentMethod: PaymentMethod;
    status: OrderStatus;
  };
}

export class CashPaymentStrategy implements PaymentStrategy {
  getPaymentDecision() {
    return {
      isPaid: false,
      paymentMethod: "cash" as const,
      status: "confirmed" as const,
    };
  }
}

export class CardPaymentStrategy implements PaymentStrategy {
  getPaymentDecision() {
    // Card flow is asynchronous; webhook confirms payment and updates status.
    return {
      isPaid: false,
      paymentMethod: "card" as const,
      status: "pending" as const,
    };
  }
}
