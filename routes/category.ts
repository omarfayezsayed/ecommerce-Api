import express from "express";
import { subCategoryRouter } from "./subCategory";
import {
  createCategoryDto,
  updateCategoryDto,
} from "../dto/categoryDto/categoryRequestDto";
import { idParamDto } from "../dto/utils/idDto";
import { validationHandler } from "../middlewares/validationHandler";
import { categoryController } from "../composition/category";

export const categoryRouter = express.Router();

categoryRouter.use("/:id/subCategories", subCategoryRouter); // nested route

categoryRouter
  .route("/")
  .post([
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
    validationHandler(idParamDto, "params"),
    validationHandler(updateCategoryDto),
    categoryController.updateCategory,
  ]);
