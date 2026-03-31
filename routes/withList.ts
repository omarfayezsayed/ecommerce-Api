import express from "express";
import passport from "../middlewares/passport/PassportRegister";
import { wishListController } from "../composition/wishList";
import { idParamDto } from "../dto/utils/idDto";
import { validationHandler } from "../middlewares/validationHandler";
import { authorize } from "../composition/rbac";
import { Permission } from "../rbac/rbacConfig";

export const wishListRouter = express.Router();

wishListRouter.use(
  passport.authenticate("jwt", { session: false, failWithError: true }),
);

wishListRouter
  .route("/")
  .post(authorize(Permission.ADD_TO_WISHLIST), wishListController.add)
  .delete(authorize(Permission.CLEAR_WISHLIST), wishListController.clear)
  .get(authorize(Permission.READ_WISHLIST), wishListController.get);
wishListRouter
  .route("/:id")
  .delete(
    authorize(Permission.REMOVE_FROM_WISHLIST),
    validationHandler(idParamDto, "params"),
    wishListController.remove,
  );
