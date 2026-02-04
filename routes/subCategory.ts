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
import { upload } from "../middlewares/uploads";
export const subCategoryRouter = express.Router({ mergeParams: true });

subCategoryRouter
  .route("/")
  .post([
    upload.single("image"),
    addMainCategoryToReqBody,
    validationHandler(createSubCategoryDto),
    subCategoryController.createSubCategory,
  ])
  .get([
    validationHandler(getAllSubCategoryForMainCategory, "params"),
    subCategoryController.getAllSubCategories,
  ]);

subCategoryRouter
  .route("/:id")
  .get([
    validationHandler(idParamDto, "params"),
    subCategoryController.getSubCategory,
  ])
  .patch([
    upload.single("image"),
    validationHandler(idParamDto, "params"),
    validationHandler(updateSubCategoryDto),
    subCategoryController.updateSubCategory,
  ])
  .delete([
    validationHandler(idParamDto, "params"),
    subCategoryController.deleteSubCategory,
  ]);
