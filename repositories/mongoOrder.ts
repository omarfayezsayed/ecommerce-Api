import { ClientSession } from "mongoose";
import { OrderDocument, OrderModel, OrderStatus } from "../models/order";
import { OrderRepository } from "./interfaces/order";

export class MongoOrderRepository implements OrderRepository {
  async create(
    orderData: Record<string, any>,
    session?: ClientSession,
  ): Promise<OrderDocument> {
    const [order] = await OrderModel.create([orderData], { session });
    return order;
  }

  async findById(id: string): Promise<OrderDocument | null> {
    return await OrderModel.findById(id).exec();
  }

  async findByUser(userId: string): Promise<OrderDocument[]> {
    return await OrderModel.find({ user: userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateStatus(
    id: string,
    status: OrderStatus,
  ): Promise<OrderDocument | null> {
    return await OrderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    ).exec();
  }

  async markPaidAndConfirmed(
    id: string,
    session?: ClientSession,
  ): Promise<OrderDocument | null> {
    return await OrderModel.findByIdAndUpdate(
      id,
      { isPaid: true, status: "confirmed" },
      { new: true, session },
    ).exec();
  }

  async delete(
    id: string,
    session?: ClientSession,
  ): Promise<OrderDocument | null> {
    return await OrderModel.findByIdAndDelete(id, { session }).exec();
  }
}
