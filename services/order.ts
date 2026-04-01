import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import { apiError } from "../utils/apiError";
import { OrderDocument, OrderStatus } from "../models/order";
import { OrderRepository } from "../repositories/interfaces/order";
import {
  ICartOrderService,
  ICouponOrderService,
  IOrderService,
  IProductInventoryService,
  OrderCartItem,
} from "./interfaces/order";
import {
  CardPaymentStrategy,
  CashPaymentStrategy,
  PaymentStrategy,
} from "./strategies/paymentStrategy";

const FIXED_SHIPPING_PRICE = 50;
const FIXED_TAX_AMOUNT = 20;
const Stripe = require("stripe");

export class OrderService implements IOrderService {
  private readonly stripe: any;

  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly cartService: ICartOrderService,
    private readonly couponService: ICouponOrderService,
    private readonly productInventoryService: IProductInventoryService,
  ) {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      throw new Error("Missing STRIPE_SECRET_KEY");
    }
    this.stripe = new Stripe(stripeSecretKey);
  }

  public placeOrder = async (
    userId: string,
    paymentMethod: "cash" | "card",
    successUrl?: string,
    cancelUrl?: string,
  ): Promise<{ order: OrderDocument; checkoutUrl?: string }> => {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const cart = await this.cartService.getCart(userId);
      if (!cart.items.length) {
        throw new apiError("Cart is empty", StatusCodes.BAD_REQUEST);
      }

      if (cart.coupon) {
        await this.couponService.validate(cart.coupon);
      }

      const strategy = this.resolvePaymentStrategy(paymentMethod);
      const paymentDecision = strategy.getPaymentDecision();

      const totalOrderPrice =
        cart.total + FIXED_SHIPPING_PRICE + FIXED_TAX_AMOUNT;

      if (paymentMethod === "cash") {
        for (const item of cart.items) {
          const reserved = await this.productInventoryService.reserveStock(
            item.productId,
            item.quantity,
            item.variantId,
            item.sizeId,
            session,
          );

          if (!reserved) {
            throw new apiError(
              `Insufficient stock for product ${item.productId}`,
              StatusCodes.CONFLICT,
            );
          }
        }
      }

      const order = await this.orderRepository.create(
        {
          user: new mongoose.Types.ObjectId(userId),
          items: cart.items.map((item) => this.mapOrderItem(item)),
          shippingPrice: FIXED_SHIPPING_PRICE,
          taxAmount: FIXED_TAX_AMOUNT,
          totalOrderPrice,
          status: paymentDecision.status,
          paymentMethod: paymentDecision.paymentMethod,
          isPaid: paymentDecision.isPaid,
          coupon: cart.coupon,
        },
        session,
      );

      let checkoutUrl: string | undefined;
      if (paymentMethod === "card") {
        if (!successUrl || !cancelUrl) {
          throw new apiError(
            "successUrl and cancelUrl are required for card payment",
            StatusCodes.BAD_REQUEST,
          );
        }

        const stripeSession = await this.stripe.checkout.sessions.create({
          mode: "payment",
          line_items: [
            {
              quantity: 1,
              price_data: {
                currency: "usd",
                unit_amount: Math.round(totalOrderPrice * 100),
                product_data: {
                  name: `Order ${order._id.toString()}`,
                },
              },
            },
          ],
          success_url: successUrl,
          cancel_url: cancelUrl,
          metadata: {
            orderId: order._id.toString(),
            userId,
          },
          payment_intent_data: {
            metadata: {
              orderId: order._id.toString(),
              userId,
            },
          },
        });

        checkoutUrl = stripeSession.url ?? undefined;
      }

      if (paymentMethod === "cash") {
        await this.cartService.clearForOrder(userId, session);
      }

      await session.commitTransaction();
      return { order, checkoutUrl };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  };

  public updateOrderStatus = async (
    orderId: string,
    status: OrderStatus,
  ): Promise<OrderDocument> => {
    const allowedStatuses: OrderStatus[] = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
    ];
    if (!allowedStatuses.includes(status)) {
      throw new apiError("Invalid order status", StatusCodes.BAD_REQUEST);
    }

    const order = await this.orderRepository.updateStatus(orderId, status);
    if (!order) {
      throw new apiError("Order not found", StatusCodes.NOT_FOUND);
    }
    return order;
  };

  public deleteOrder = async (
    userId: string,
    orderId: string,
  ): Promise<void> => {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const order = await this.orderRepository.findById(orderId);
      if (!order) {
        throw new apiError("Order not found", StatusCodes.NOT_FOUND);
      }

      if (order.user.toString() !== userId) {
        throw new apiError("Forbidden", StatusCodes.FORBIDDEN);
      }

      for (const item of order.items) {
        const released = await this.productInventoryService.releaseStock(
          item.product.toString(),
          item.quantity,
          item.variantId?.toString(),
          item.sizeId?.toString(),
          session,
        );

        if (!released) {
          throw new apiError(
            `Failed to restore stock for product ${item.product.toString()}`,
            StatusCodes.CONFLICT,
          );
        }
      }

      await this.orderRepository.delete(orderId, session);
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  };

  public getUserOrders = async (userId: string): Promise<OrderDocument[]> => {
    return await this.orderRepository.findByUser(userId);
  };

  public getUserOrderById = async (
    userId: string,
    orderId: string,
  ): Promise<OrderDocument> => {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new apiError("Order not found", StatusCodes.NOT_FOUND);
    }

    if (order.user.toString() !== userId) {
      throw new apiError("Forbidden", StatusCodes.FORBIDDEN);
    }

    return order;
  };

  public handleStripeWebhook = async (event: any): Promise<void> => {
    if (!event || !event.type) {
      throw new apiError("Invalid webhook payload", StatusCodes.BAD_REQUEST);
    }

    if (
      event.type !== "payment_intent.succeeded" &&
      event.type !== "checkout.session.completed"
    ) {
      return;
    }

    const orderId =
      event?.data?.object?.metadata?.orderId ||
      event?.data?.object?.payment_intent?.metadata?.orderId;
    if (!orderId) {
      throw new apiError(
        "Missing orderId in webhook metadata",
        StatusCodes.BAD_REQUEST,
      );
    }

    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const order = await this.orderRepository.findById(orderId);
      if (!order) {
        throw new apiError("Order not found", StatusCodes.NOT_FOUND);
      }

      if (order.paymentMethod !== "card") {
        throw new apiError(
          "Webhook order is not a card order",
          StatusCodes.BAD_REQUEST,
        );
      }

      if (order.isPaid && order.status === "confirmed") {
        await session.commitTransaction();
        return;
      }

      for (const item of order.items) {
        const reserved = await this.productInventoryService.reserveStock(
          item.product.toString(),
          item.quantity,
          item.variantId?.toString(),
          item.sizeId?.toString(),
          session,
        );

        if (!reserved) {
          throw new apiError(
            `Insufficient stock for product ${item.product.toString()}`,
            StatusCodes.CONFLICT,
          );
        }
      }

      await this.cartService.clearForOrder(order.user.toString(), session);
      await this.orderRepository.markPaidAndConfirmed(orderId, session);

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  };

  private resolvePaymentStrategy(method: "cash" | "card"): PaymentStrategy {
    if (method === "card") return new CardPaymentStrategy();
    return new CashPaymentStrategy();
  }

  private mapOrderItem(item: OrderCartItem) {
    return {
      product: new mongoose.Types.ObjectId(item.productId),
      quantity: item.quantity,
      price: item.price,
      variantId: item.variantId
        ? new mongoose.Types.ObjectId(item.variantId)
        : undefined,
      sizeId: item.sizeId
        ? new mongoose.Types.ObjectId(item.sizeId)
        : undefined,
    };
  }
}
