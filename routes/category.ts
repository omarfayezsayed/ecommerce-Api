import express, { NextFunction } from "express";
import { categoryController } from "../controllers/categoryController";
import { subCategoryRouter } from "./subCategory";
import {
  createCategoryDto,
  getCategoryDto,
  deleteCategoryDto,
  updateCategoryDto,
} from "../dto/categoryDto/categoryRequestDto";
import { validationHandler } from "../middlewares/validationHandler2";

export const categoryRouter = express.Router();

const categoryHandler = new categoryController();

categoryRouter.use("/:id/subCategories", subCategoryRouter); // nested route

categoryRouter
  .route("/")
  .post([
    validationHandler(createCategoryDto),
    categoryHandler.createCategoryHandler,
  ])
  .get(categoryHandler.getAllCategoriesHandler);

categoryRouter
  .route("/:id")
  .get([validationHandler(getCategoryDto), categoryHandler.getCategoryHandler])
  .delete([
    validationHandler(deleteCategoryDto),
    categoryHandler.deleteCategoryHandler,
  ])
  .patch([
    validationHandler(updateCategoryDto),
    categoryHandler.updateCategoryHandler,
  ]);
