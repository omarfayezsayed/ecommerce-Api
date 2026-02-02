import express from "express";
import { subCategoryRouter } from "./subCategory";
import {
  createCategoryDto,
  updateCategoryDto,
} from "../dto/categoryDto/categoryRequestDto";
import { idParamDto } from "../dto/utils/idDto";
import { validationHandler } from "../middlewares/validationHandler";
import { categoryController } from "../composition/category";
import { upload } from "../middlewares/uploads";

export const categoryRouter = express.Router();

categoryRouter.use("/:id/subCategories", subCategoryRouter); // nested route

categoryRouter
  .route("/")
  .post([
    upload.single("image"),
    validationHandler(createCategoryDto),
    categoryController.createCategory,
  ])
  .get(categoryController.getAllCategories);

categoryRouter
  .route("/:id")
  .get([
    validationHandler(idParamDto, "params"),
    categoryController.getCategory,
  ])
  .delete([
    validationHandler(idParamDto, "params"),
    categoryController.deleteCategory,
  ])
  .patch([
    upload.single("image"),
    validationHandler(idParamDto, "params"),
    validationHandler(updateCategoryDto),
    categoryController.updateCategory,
  ]);
