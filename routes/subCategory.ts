import express from "express";
import * as subCategory from "../services/subCategoryService";
export const subCategoryRouter = express.Router({ mergeParams: true });

subCategoryRouter
  .route("/")
  .post(subCategory.createSubCategory)
  .get(subCategory.getAllSubCategories);

subCategoryRouter
  .route("/:id")
  .get(subCategory.getSubCategory)
  .patch(subCategory.updateSubCategory)
  .delete(subCategory.deleteSubCategory);
