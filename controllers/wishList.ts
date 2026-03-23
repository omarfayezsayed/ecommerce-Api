import { StatusCodes } from "http-status-codes";
import { UserRole } from "../rbac/rbacConfig";
import { WishlistService } from "../services/wishList";
import { asyncWrapper } from "../utils/asyncWrapper";
import { Request, Response } from "express";

export class WishlistController {
  constructor(private wishListService: WishlistService) {}
  public get = asyncWrapper(async (req: Request, res: Response) => {
    // userId from JWT — no need to pass it in URL
    const wishlist = await this.wishListService.get(req.user!.id);
    res.status(StatusCodes.OK).json({
      status: "success",
      data: wishlist,
    });
  });

  public add = asyncWrapper(async (req: Request, res: Response) => {
    console.log(req.user!.id, req.body.product);
    const wishlist = await this.wishListService.add(
      req.user!.id,
      req.body.product,
    );
    res.status(StatusCodes.CREATED).json({
      status: "success",
    });
  });

  public remove = asyncWrapper(async (req: any, res: Response) => {
    // wishlist item id from URL params
    // userId from JWT
    await this.wishListService.remove(req.user.id, req.params.id);
    res.status(StatusCodes.NO_CONTENT).json({ status: "success" });
  });

  public clear = asyncWrapper(async (req: any, res: Response) => {
    await this.wishListService.clear(req.user.id);
    res.json({ message: "Wishlist cleared" });
  });
}
