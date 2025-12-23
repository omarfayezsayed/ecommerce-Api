import express from "express";
import { validationHandler } from "../middlewares/validationHandler";
import { addMainCategoryToReqBody } from "../controllers/subCategory";
import {
  createSubCategoryDto,
  updateSubCategoryDto,
  getAllSubCategoryForMainCategory,
} from "../dto/subCategoryDto/subCategoryRequestDto";
import { idParamDto } from "../dto/utils/idDto";
import { subCategoryController } from "../composition/subCategory";
export const subCategoryRouter = express.Router({ mergeParams: true });

subCategoryRouter
  .route("/")
  .post([
    addMainCategoryToReqBody,
    validationHandler(createSubCategoryDto),
    subCategoryController.createSubCategory,
  ])
  .get([
    validationHandler(getAllSubCategoryForMainCategory),
    subCategoryController.getAllSubCategories,
  ]);

subCategoryRouter
  .route("/:id")
  .get([
    validationHandler(idParamDto, "params"),
    subCategoryController.getSubCategory,
  ])
  .patch([
    validationHandler(idParamDto, "params"),
    validationHandler(updateSubCategoryDto),
    subCategoryController.updateSubCategory,
  ])
  .delete([
    validationHandler(idParamDto, "params"),
    subCategoryController.deleteSubCategory,
  ]);
