import express from "express";
import { brandController } from "../composition/brand";
import {
  createBrandDto,
  updateBrandDto,
} from "../dto/brandDto/brandRequestDto";
import { idParamDto } from "../dto/utils/idDto";
import { validationHandler } from "../middlewares/validationHandler";
export const brandRouter = express.Router();
brandRouter
  .route("/")
  .get([brandController.findAllBrands])
  .post([validationHandler(createBrandDto), brandController.createBrand]);

brandRouter
  .route("/:id")
  .get([validationHandler(idParamDto, "params"), brandController.getBrand])
  .patch([
    validationHandler(idParamDto, "params"),
    validationHandler(updateBrandDto),
    brandController.updateBrand,
  ])
  .delete([
    validationHandler(idParamDto, "params"),
    brandController.deleteBrand,
  ]);
