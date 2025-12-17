import express from "express";
import { validationHandler } from "../middlewares/validationHandler2";
import {
  subCategoryController,
  addMainCategoryToReqBody,
} from "../controllers/subCategoryControllers";
import {
  createSubCategoryDto,
  deleteSubCategoryDto,
  updateSubCategoryDto,
  getSubCategoryDto,
} from "../dto/subCategoryDto/subCategoryRequestDto";
export const subCategoryRouter = express.Router({ mergeParams: true });

const subCategoryHandler = new subCategoryController();
subCategoryRouter
  .route("/")
  .post([
    validationHandler(createSubCategoryDto),
    subCategoryHandler.createSubCategoryHandler,
  ])
  .get([subCategoryHandler.getAllSubCategoriesHandler]);

subCategoryRouter
  .route("/:id")
  .get([
    validationHandler(getSubCategoryDto),
    subCategoryHandler.getSubCategoryHandler,
  ])
  .patch([
    validationHandler(updateSubCategoryDto),
    subCategoryHandler.updateSubCategoryHandler,
  ])
  .delete([
    validationHandler(deleteSubCategoryDto),
    subCategoryHandler.deleteSubCategoryHandler,
  ]);
