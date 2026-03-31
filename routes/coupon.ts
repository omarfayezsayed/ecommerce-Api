// routes/address.router.ts
import express from "express";
import passport from "../middlewares/passport/PassportRegister";
import { couponController } from "../composition/coupon";
import { validationHandler } from "../middlewares/validationHandler";
import {
  CreateCouponDto,
  UpdateCouponDto,
} from "../dto/couponDto/couponRequestDto";
import { idParamDto } from "../dto/utils/idDto";
import { authorize } from "../composition/rbac";
import { Permission } from "../rbac/rbacConfig";

export const couponRouter = express.Router();

// couponRouter.use(
//   passport.authenticate("jwt", { session: false, failWithError: true }),
// );
couponRouter.route("/validate").get(couponController.validate);
couponRouter
  .route("/")
  .get(couponController.getAll)
  .post(
    authorize(Permission.CREATE_COUPON),
    validationHandler(CreateCouponDto),
    couponController.create,
  );
couponRouter
  .route("/:id")
  .get(
    authorize(Permission.READ_COUPON),
    validationHandler(idParamDto, "params"),
    couponController.getById,
  )
  .patch(
    authorize(Permission.UPDATE_COUPON),
    validationHandler(idParamDto, "params"),
    couponController.update,
  )
  .delete(
    authorize(Permission.DELETE_COUPON),
    validationHandler(idParamDto, "params"),
    couponController.delete,
  );
