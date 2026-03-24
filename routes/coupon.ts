// routes/address.router.ts
import express from "express";
import passport from "../middlewares/passport/PassportRegister";
import { couponController } from "../composition/coupon";

export const couponRouter = express.Router();

couponRouter.use(
  passport.authenticate("jwt", { session: false, failWithError: true }),
);
couponRouter.route("/validate").get(couponController.validate);
couponRouter
  .route("/")
  .get(couponController.getAll)
  .post(couponController.create);
couponRouter
  .route("/:id")
  .get(couponController.getById)
  .patch(couponController.update)
  .delete(couponController.delete);
