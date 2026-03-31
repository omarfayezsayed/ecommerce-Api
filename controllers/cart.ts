import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { asyncWrapper } from "../utils/asyncWrapper";
import { CartService } from "../services/cart";

export class CartController {
  constructor(private readonly cartService: CartService) {}

  public getCart = asyncWrapper(async (req: Request, res: Response) => {
    const cart = await this.cartService.getCart(req.user!.id);
    res.status(StatusCodes.OK).json({
      status: "success",
      data: cart,
    });
  });

  public addItem = asyncWrapper(async (req: Request, res: Response) => {
    const cart = await this.cartService.addItem(req.user!.id, req.body);
    res.status(StatusCodes.CREATED).json({
      status: "success",
      data: cart,
    });
  });

  public updateQuantity = asyncWrapper(async (req: Request, res: Response) => {
    const cart = await this.cartService.updateItemQuantity(
      req.user!.id,
      req.body,
    );
    res.status(StatusCodes.OK).json({
      status: "success",
      data: cart,
    });
  });

  public removeItem = asyncWrapper(async (req: Request, res: Response) => {
    const cart = await this.cartService.removeItem(req.user!.id, req.body);
    res.status(StatusCodes.OK).json({
      status: "success",
      data: cart,
    });
  });

  public applyCoupon = asyncWrapper(async (req: Request, res: Response) => {
    const cart = await this.cartService.applyCoupon(req.user!.id, req.body);
    res.status(StatusCodes.OK).json({
      status: "success",
      data: cart,
    });
  });

  public removeCoupon = asyncWrapper(async (req: Request, res: Response) => {
    const cart = await this.cartService.removeCoupon(req.user!.id);
    res.status(StatusCodes.OK).json({
      status: "success",
      data: cart,
    });
  });
}
