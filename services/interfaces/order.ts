import { ClientSession } from "mongoose";
import { OrderDocument, OrderStatus } from "../../models/order";

export type OrderCartItem = {
  productId: string;
  variantId?: string;
  sizeId?: string;
  quantity: number;
  price: number;
};

export type OrderCartView = {
  items: OrderCartItem[];
  total: number;
  coupon?: string;
};

export interface ICartOrderService {
  getCart(userId: string): Promise<OrderCartView>;
  clearForOrder(userId: string, session?: ClientSession): Promise<unknown>;
}

export interface ICouponOrderService {
  validate(name: string): Promise<{ name: string }>;
}

export interface IProductInventoryService {
  reserveStock(
    productId: string,
    quantity: number,
    variantId?: string,
    sizeId?: string,
    session?: ClientSession,
  ): Promise<boolean>;
  releaseStock(
    productId: string,
    quantity: number,
    variantId?: string,
    sizeId?: string,
    session?: ClientSession,
  ): Promise<boolean>;
}

export interface IOrderService {
  placeOrder(
    userId: string,
    paymentMethod: "cash" | "card",
    successUrl?: string,
    cancelUrl?: string,
  ): Promise<{ order: OrderDocument; checkoutUrl?: string }>;
  updateOrderStatus(
    orderId: string,
    status: OrderStatus,
  ): Promise<OrderDocument>;
  deleteOrder(userId: string, orderId: string): Promise<void>;
  getUserOrders(userId: string): Promise<OrderDocument[]>;
  getUserOrderById(userId: string, orderId: string): Promise<OrderDocument>;
  handleStripeWebhook(event: any): Promise<void>;
}
