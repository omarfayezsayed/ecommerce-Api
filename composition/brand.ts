import { BrandController } from "../controllers/brand";
import { MongoBrandRepository } from "../repositories/mongoBrand";
import { BrandService } from "../services/brand";
import { imageService } from "./imageProcessor";
const mongoBrandRepository = new MongoBrandRepository();

export const brandService = new BrandService(
  mongoBrandRepository,
  imageService,
);
export const brandController = new BrandController(brandService);
