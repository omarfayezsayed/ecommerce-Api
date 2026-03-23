import express from "express";
import passport from "../middlewares/passport/PassportRegister";
import { wishListController } from "../composition/wishList";
import { idParamDto } from "../dto/utils/idDto";
import { validationHandler } from "../middlewares/validationHandler";

export const wishListRouter = express.Router();

wishListRouter.use(
  passport.authenticate("jwt", { session: false, failWithError: true }),
);

wishListRouter
  .route("/")
  .post(wishListController.add)
  .delete(wishListController.clear)
  .get(wishListController.get);
wishListRouter
  .route("/:id")
  .delete(validationHandler(idParamDto, "params"), wishListController.remove);
