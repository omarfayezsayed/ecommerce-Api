// controllers/coupon.controller.ts
import { Request, Response } from "express";
import { asyncWrapper } from "../utils/asyncWrapper";
import { CouponService } from "../services/coupon";
import { StatusCodes } from "http-status-codes";

export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  public getAll = asyncWrapper(async (req: Request, res: Response) => {
    const coupons = await this.couponService.getAll();
    res.status(StatusCodes.OK).json({
      status: "success",
      data: coupons,
    });
  });

  public getById = asyncWrapper(async (req: Request, res: Response) => {
    const coupon = await this.couponService.getById(req.params.id);
    res.status(StatusCodes.OK).json({
      status: "success",
      data: coupon,
    });
  });

  public create = asyncWrapper(async (req: Request, res: Response) => {
    const coupon = await this.couponService.create(req.body);
    res.status(StatusCodes.CREATED).json({
      status: "success",
      data: coupon,
    });
  });

  public update = asyncWrapper(async (req: Request, res: Response) => {
    const coupon = await this.couponService.update(req.params.id, req.body);
    res.status(StatusCodes.OK).json({
      status: "success",
      data: coupon,
    });
  });

  public delete = asyncWrapper(async (req: Request, res: Response) => {
    await this.couponService.delete(req.params.id);
    res.status(StatusCodes.NO_CONTENT).send();
  });

  // validate coupon — called when user applies coupon to cart
  public validate = asyncWrapper(async (req: Request, res: Response) => {
    console.log(req.query.name);
    const coupon = await this.couponService.validate(req.query.name! as string);
    res.status(StatusCodes.OK).json({
      discount: coupon.discount,
      message: `Coupon applied — ${coupon.discount}% off`,
    });
  });
}
