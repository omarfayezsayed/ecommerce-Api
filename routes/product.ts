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

export const productRouter = express.Router({ mergeParams: true });

// categoryRouter.use("/:id/subCategories", subCategoryRouter); // nested route

productRouter
  .route("/")
  .post([
    upload.fields([{ name: "imageCover" }, { name: "images" }]),
    validationHandler(createProductDto),
    productController.createProduct,
  ])
  .get(productController.findAllProducts);

productRouter
  .route("/:id")
  .get([validationHandler(idParamDto, "params"), productController.getProduct])
  .delete([
    validationHandler(idParamDto, "params"),
    productController.deleteProduct,
  ])
  .patch([
    upload.fields([{ name: "imageCover" }, { name: "images" }]),
    validationHandler(idParamDto, "params"),
    validationHandler(updateProductDto),
    productController.updateProduct,
  ]);
