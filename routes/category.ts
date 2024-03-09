import express from "express";
import * as category from "../controllers/categoryController";
import { categoryController } from "../controllers/categoryController";
import {
  createCategoryValidations,
  getCategoryValidations,
  deleteCategoryValidations,
  updateCategoryValidations,
} from "../middlewares/validations/categoryValidations";
import { validationChecker } from "../middlewares/validationHandler";
export const categoryRouter = express.Router();
const categoryHandler = new categoryController();
// categoryRouter.use("/:id/subCategories", subCategoryRouter);

categoryRouter
  .route("/")
  .post([
    createCategoryValidations,
    validationChecker,
    categoryHandler.createCategoryHandler,
  ])
  .get(categoryHandler.getAllCategoriesHandler);

categoryRouter
  .route("/:id")
  .get([
    getCategoryValidations,
    validationChecker,
    categoryHandler.getCategoryHandler,
  ])
  .delete([
    deleteCategoryValidations,
    validationChecker,
    categoryHandler.deleteCategoryHandler,
  ])
  .patch([
    updateCategoryValidations,
    validationChecker,
    categoryHandler.updateCategoryHandler,
  ]);
