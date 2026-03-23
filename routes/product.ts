import express from "express";
import { subCategoryRouter } from "./subCategory";
import {
  createProductDto,
  updateProductDto,
} from "../dto/productDto/productRequestDto";
import { idParamDto } from "../dto/utils/idDto";
import { validationHandler } from "../middlewares/validationHandler";
import { productController } from "../composition/product";
import { upload } from "../middlewares/uploads";
import passport from "../middlewares/passport/PassportRegister";
import { authorize } from "../composition/rbac";
import { Permission } from "../rbac/rbacConfig";
import { reviewRouter } from "./review";
export const productRouter = express.Router({ mergeParams: true });

// categoryRouter.use("/:id/subCategories", subCategoryRouter); // nested route
productRouter.use("/:id/reviews", reviewRouter);
productRouter
  .route("/")
  .post([
    passport.authenticate("jwt", { session: false, failWithError: true }),
    authorize(Permission.CREATE_PRODUCT),
    upload.fields([{ name: "imageCover" }, { name: "images" }]),
    validationHandler(createProductDto),
    productController.createProduct,
  ])
  .get(productController.findAllProducts);

productRouter
  .route("/:id")
  .get([validationHandler(idParamDto, "params"), productController.getProduct])
  .delete([
    authorize(Permission.DELETE_PRODUCT),
    passport.authenticate("jwt", { session: false, failWithError: true }),
    validationHandler(idParamDto, "params"),
    productController.deleteProduct,
  ])
  .patch([
    passport.authenticate("jwt", { session: false, failWithError: true }),
    authorize(Permission.UPDATE_PRODUCT),
    upload.fields([{ name: "imageCover" }, { name: "images" }]),
    validationHandler(idParamDto, "params"),
    validationHandler(updateProductDto),
    productController.updateProduct,
  ]);
