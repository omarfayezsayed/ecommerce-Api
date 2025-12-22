import express, { NextFunction } from "express";
import { categoryController } from "../controllers/categoryController";
import { subCategoryRouter } from "./subCategory";
import {
  createCategoryDto,
  updateCategoryDto,
} from "../dto/categoryDto/categoryRequestDto";
import { idParamDto } from "../dto/utils/idDto";
import { validationHandler } from "../middlewares/validationHandler";

export const categoryRouter = express.Router();

const categoryHandler = new categoryController();

categoryRouter.use("/:id/subCategories", subCategoryRouter); // nested route

categoryRouter
  .route("/")
  .post([
    validationHandler(createCategoryDto),
    categoryHandler.createOneHandler,
  ])
  .get(categoryHandler.getAllCategoriesHandler);

categoryRouter
  .route("/:id")
  .get([
    validationHandler(idParamDto, "params"),
    categoryHandler.getCategoryHandler,
  ])
  .delete([
    validationHandler(idParamDto, "params"),
    categoryHandler.deleteOneHandler,
  ])
  .patch([
    validationHandler(idParamDto, "params"),
    validationHandler(updateCategoryDto),
    categoryHandler.updateOneHandler,
  ]);
