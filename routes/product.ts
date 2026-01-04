import express from "express";
import { subCategoryRouter } from "./subCategory";
import {
  createProductDto,
  updateProductDto,
} from "../dto/productDto/productRequestDto";
import { idParamDto } from "../dto/utils/idDto";
import { validationHandler } from "../middlewares/validationHandler";
import { productController } from "../composition/product";

export const productRouter = express.Router();

// categoryRouter.use("/:id/subCategories", subCategoryRouter); // nested route

productRouter
  .route("/")
  .post([validationHandler(createProductDto), productController.createProduct])
  .get(productController.findAllProducts);

productRouter
  .route("/:id")
  .get([validationHandler(idParamDto, "params"), productController.getProduct])
  .delete([
    validationHandler(idParamDto, "params"),
    productController.deleteProduct,
  ])
  .patch([
    validationHandler(idParamDto, "params"),
    validationHandler(updateProductDto),
    productController.updateProduct,
  ]);
