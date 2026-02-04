import { SubCategoryController } from "../controllers/subCategory";
import { SubCategoryRepository } from "../repositories/interfaces/subCategory";
import { MongoCategoryRepository } from "../repositories/mongoCategory";
import { MongoSubCategoryRepository } from "../repositories/mongoSubCategory";
import { CategoryService } from "../services/category";
import { CategoryQuery } from "../services/interfaces/category";
import { SubCategoryService } from "../services/subCategory";
import { azureStorageService } from "../services/azureStorage";
const mongoSubcategoryRespository: SubCategoryRepository =
  new MongoSubCategoryRepository();
const categoryQuerySerivce: CategoryQuery = new CategoryService(
  new MongoCategoryRepository(),
  azureStorageService,
);
const subCategoryService = new SubCategoryService(
  mongoSubcategoryRespository,
  categoryQuerySerivce,
  azureStorageService,
);
export const subCategoryController = new SubCategoryController(
  subCategoryService,
);
