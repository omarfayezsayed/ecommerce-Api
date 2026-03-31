import express from "express";
import passport from "../middlewares/passport/PassportRegister";
import { cartController } from "../composition/cart";
import { authorize } from "../composition/rbac";
import { Permission } from "../rbac/rbacConfig";
import { validationHandler } from "../middlewares/validationHandler";
import {
  AddCartItemDto,
  ApplyCouponDto,
  RemoveCartItemDto,
  UpdateCartItemDto,
} from "../dto/cartDto/cartRequestDto";

export const cartRouter = express.Router();

cartRouter.use(
  passport.authenticate("jwt", { session: false, failWithError: true }),
);

cartRouter
  .route("/")
  .get(authorize(Permission.READ_CART), cartController.getCart);

cartRouter
  .route("/items")
  .post(
    authorize(Permission.UPDATE_CART),
    validationHandler(AddCartItemDto),
    cartController.addItem,
  )
  .patch(
    authorize(Permission.UPDATE_CART),
    validationHandler(UpdateCartItemDto),
    cartController.updateQuantity,
  )
  .delete(
    authorize(Permission.UPDATE_CART),
    validationHandler(RemoveCartItemDto),
    cartController.removeItem,
  );

cartRouter.post(
  "/apply-coupon",
  authorize(Permission.UPDATE_CART),
  validationHandler(ApplyCouponDto),
  cartController.applyCoupon,
);

cartRouter.delete(
  "/coupon",
  authorize(Permission.UPDATE_CART),
  cartController.removeCoupon,
);
