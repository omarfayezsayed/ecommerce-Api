import { BrandController } from "../controllers/brand";
import { MongoBrandRepository } from "../repositories/mongoBrand";
import { BrandService } from "../services/brand";
import { azureStorageService } from "../services/azureStorage";
const mongoBrandRepository = new MongoBrandRepository();
const brandService = new BrandService(
  mongoBrandRepository,
  azureStorageService,
);
export const brandController = new BrandController(brandService);
