import express from "express";
import { brandController } from "../controllers/brand";
import {
  createBrandDto,
  deleteBrandDto,
  updateBrandDto,
  getBrandDto,
} from "../dto/brandDto/brandRequestDto";
import { validationHandler } from "../middlewares/validationHandler2";
export const brandRouter = express.Router();
const brandHandler = new brandController();
brandRouter
  .route("/")
  .get([brandHandler.findAllBrandsHandler])
  .post([validationHandler(createBrandDto), brandHandler.createBrandHandler]);

brandRouter
  .route("/:id")
  .get([validationHandler(getBrandDto), brandHandler.getBrandHandler])
  .patch([validationHandler(updateBrandDto), brandHandler.updateBrandHandler])
  .delete([validationHandler(deleteBrandDto), brandHandler.deleteBrandHandler]);
