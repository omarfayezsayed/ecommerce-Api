import express from "express";
import { validationHandler } from "../middlewares/validationHandler";
import {
  subCategoryController,
  addMainCategoryToReqBody,
} from "../controllers/subCategoryControllers";
import {
  createSubCategoryDto,
  updateSubCategoryDto,
  getAllSubCategoryForMainCategory,
} from "../dto/subCategoryDto/subCategoryRequestDto";
import { idParamDto } from "../dto/utils/idDto";

export const subCategoryRouter = express.Router({ mergeParams: true });

const subCategoryHandler = new subCategoryController();
subCategoryRouter
  .route("/")
  .post([
    addMainCategoryToReqBody,
    validationHandler(createSubCategoryDto),
    subCategoryHandler.createSubCategoryHandler,
  ])
  .get([
    validationHandler(getAllSubCategoryForMainCategory),
    subCategoryHandler.getAllSubCategoriesHandler,
  ]);

subCategoryRouter
  .route("/:id")
  .get([
    validationHandler(idParamDto, "params"),
    subCategoryHandler.getSubCategoryHandler,
  ])
  .patch([
    validationHandler(idParamDto, "params"),
    validationHandler(updateSubCategoryDto),
    subCategoryHandler.updateSubCategoryHandler,
  ])
  .delete([
    validationHandler(idParamDto, "params"),
    subCategoryHandler.deleteSubCategoryHandler,
  ]);
