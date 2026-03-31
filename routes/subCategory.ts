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
import passport from "../middlewares/passport/PassportRegister";
import { authorize } from "../composition/rbac";
import { Permission } from "../rbac/rbacConfig";
subCategoryRouter
  .route("/")
  .post([
    passport.authenticate("jwt", { session: false, failWithError: true }),
    authorize(Permission.CREATE_SUBCATEGORY),
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
    passport.authenticate("jwt", { session: false, failWithError: true }),
    validationHandler(idParamDto, "params"),
    subCategoryController.getSubCategory,
  ])
  .patch([
    passport.authenticate("jwt", { session: false, failWithError: true }),
    authorize(Permission.UPDATE_SUBCATEGORY),
    upload.single("image"),
    validationHandler(idParamDto, "params"),
    validationHandler(updateSubCategoryDto),
    subCategoryController.updateSubCategory,
  ])
  .delete([
    passport.authenticate("jwt", { session: false, failWithError: true }),
    authorize(Permission.DELETE_SUBCATEGORY),
    validationHandler(idParamDto, "params"),
    subCategoryController.deleteSubCategory,
  ]);
