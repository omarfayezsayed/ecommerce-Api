import { BrandController } from "../controllers/brand";
import { MongoBrandRepository } from "../repositories/mongoBrand";
import { BrandService } from "../services/brand";

const mongoBrandRepository = new MongoBrandRepository();
const brandService = new BrandService(mongoBrandRepository);
export const brandController = new BrandController(brandService);
