import express from "express";
import { subCategoryRouter } from "./subCategory";
import {
  createCategoryDto,
  updateCategoryDto,
} from "../dto/categoryDto/categoryRequestDto";
import { idParamDto } from "../dto/utils/idDto";
import { validationHandler } from "../middlewares/validationHandler";
import { categoryController } from "../composition/category";
import { upload } from "../middlewares/uploads";
import passport from "../middlewares/passport/PassportRegister";
import { authorize } from "../composition/rbac";
import { Permission } from "../rbac/rbacConfig";
export const categoryRouter = express.Router();

categoryRouter.use("/:id/subCategories", subCategoryRouter); // nested route

categoryRouter
  .route("/")
  .post([
    passport.authenticate("jwt", { session: false, failWithError: true }),
    authorize(Permission.CREATE_CATEGORY),
    upload.single("image"),
    validationHandler(createCategoryDto),
    categoryController.createCategory,
  ])
  .get(categoryController.getAllCategories);

categoryRouter
  .route("/:id")
  .get([
    validationHandler(idParamDto, "params"),
    categoryController.getCategory,
  ])
  .delete([
    passport.authenticate("jwt", { session: false, failWithError: true }),
    authorize(Permission.DELETE_CATEGORY),
    validationHandler(idParamDto, "params"),
    categoryController.deleteCategory,
  ])
  .patch([
    passport.authenticate("jwt", { session: false, failWithError: true }),
    authorize(Permission.UPDATE_CATEGORY),
    upload.single("image"),
    validationHandler(idParamDto, "params"),
    validationHandler(updateCategoryDto),
    categoryController.updateCategory,
  ]);
