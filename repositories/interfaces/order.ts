import { ClientSession } from "mongoose";
import { OrderDocument, OrderStatus } from "../../models/order";

export interface OrderRepository {
  create(
    orderData: Record<string, any>,
    session?: ClientSession,
  ): Promise<OrderDocument>;
  findById(id: string): Promise<OrderDocument | null>;
  findByUser(userId: string): Promise<OrderDocument[]>;
  updateStatus(id: string, status: OrderStatus): Promise<OrderDocument | null>;
  markPaidAndConfirmed(
    id: string,
    session?: ClientSession,
  ): Promise<OrderDocument | null>;
  delete(id: string, session?: ClientSession): Promise<OrderDocument | null>;
}
