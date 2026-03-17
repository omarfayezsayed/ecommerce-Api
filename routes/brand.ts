import express from "express";
import { brandController } from "../composition/brand";
import {
  createBrandDto,
  updateBrandDto,
} from "../dto/brandDto/brandRequestDto";
import { idParamDto } from "../dto/utils/idDto";
import { validationHandler } from "../middlewares/validationHandler";
import { productRouter } from "./product";
import { upload } from "../middlewares/uploads";
import passport from "../middlewares/passport/PassportRegister";
import { authorize } from "../composition/rbac";
import { Permission } from "../rbac/rbacConfig";
export const brandRouter = express.Router();
brandRouter.use("/:id/products", productRouter);
brandRouter
  .route("/")
  .get([brandController.findAllBrands])
  .post([
    passport.authenticate("jwt", { session: false, failWithError: true }),
    authorize(Permission.CREATE_BRAND),
    upload.single("image"),
    validationHandler(createBrandDto),
    brandController.createBrand,
  ]);

brandRouter
  .route("/:id")
  .get([validationHandler(idParamDto, "params"), brandController.getBrand])
  .patch([
    passport.authenticate("jwt", { session: false, failWithError: true }),
    authorize(Permission.UPDATE_BRAND),
    upload.single("image"),
    validationHandler(idParamDto, "params"),
    validationHandler(updateBrandDto),
    brandController.updateBrand,
  ])
  .delete([
    passport.authenticate("jwt", { session: false, failWithError: true }),
    authorize(Permission.DELETE_BRAND),
    validationHandler(idParamDto, "params"),
    brandController.deleteBrand,
  ]);
