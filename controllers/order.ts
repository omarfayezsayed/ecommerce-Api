import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { asyncWrapper } from "../utils/asyncWrapper";
import { OrderService } from "../services/order";

export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  public placeOrder = asyncWrapper(async (req: Request, res: Response) => {
    const result = await this.orderService.placeOrder(
      req.user!.id,
      req.body.paymentMethod,
      req.body.successUrl,
      req.body.cancelUrl,
    );

    res.status(StatusCodes.CREATED).json({
      status: "success",
      data: result,
    });
  });

  public updateStatus = asyncWrapper(async (req: Request, res: Response) => {
    const order = await this.orderService.updateOrderStatus(
      req.params.id,
      req.body.status,
    );

    res.status(StatusCodes.OK).json({
      status: "success",
      data: order,
    });
  });

  public deleteOrder = asyncWrapper(async (req: Request, res: Response) => {
    await this.orderService.deleteOrder(req.user!.id, req.params.id);
    res.status(StatusCodes.NO_CONTENT).send();
  });

  public getMyOrders = asyncWrapper(async (req: Request, res: Response) => {
    const orders = await this.orderService.getUserOrders(req.user!.id);
    res.status(StatusCodes.OK).json({
      status: "success",
      records: orders.length,
      data: orders,
    });
  });

  public getMyOrderById = asyncWrapper(async (req: Request, res: Response) => {
    const order = await this.orderService.getUserOrderById(
      req.user!.id,
      req.params.id,
    );

    res.status(StatusCodes.OK).json({
      status: "success",
      data: order,
    });
  });

  public stripeWebhook = asyncWrapper(async (req: Request, res: Response) => {
    await this.orderService.handleStripeWebhook(req.body);
    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Webhook processed",
    });
  });
}
