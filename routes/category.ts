import express from "express";
import * as category from "../services/categoryService";
// import { Category } from "../models/category";
import { subCategoryRouter } from "./subCategory";
export const categoryRouter = express.Router();

categoryRouter.use("/:id/subCategories", subCategoryRouter);

categoryRouter
  .route("/")
  .post(category.createCategory)
  .get(category.getAllCategories);

categoryRouter
  .route("/:id")
  .get(category.getCategory)
  .delete(category.deleteCategory)
  .patch(category.updateCategory);
