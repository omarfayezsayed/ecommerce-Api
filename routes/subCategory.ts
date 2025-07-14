import express from "express";
import {
  subCategoryController,
  addMainCategoryToReqBody,
} from "../controllers/subCategoryControllers";
import {
  createSubCategoryValidations,
  deleteSubCategoryValidations,
  getSubCategoryValidations,
  updateSubCategoryValidations,
  getAllSubCategoriesValidations,
} from "../middlewares/validations/subCategoryValidations";
import { validationChecker } from "../middlewares/validationHandler";
export const subCategoryRouter = express.Router({ mergeParams: true });

const subCategoryHandler = new subCategoryController();
subCategoryRouter
  .route("/")
  .post([
    addMainCategoryToReqBody,
    createSubCategoryValidations,
    validationChecker,
    subCategoryHandler.createSubCategoryHandler,
  ])
  .get([
    getAllSubCategoriesValidations,
    validationChecker,
    subCategoryHandler.getAllSubCategoriesHandler,
  ]);

subCategoryRouter
  .route("/:id")
  .get([
    getSubCategoryValidations,
    validationChecker,
    subCategoryHandler.getSubCategoryHandler,
  ])
  .patch([
    updateSubCategoryValidations,
    validationChecker,
    subCategoryHandler.updateSubCategoryHandler,
  ])
  .delete([
    deleteSubCategoryValidations,
    validationChecker,
    subCategoryHandler.deleteSubCategoryHandler,
  ]);
