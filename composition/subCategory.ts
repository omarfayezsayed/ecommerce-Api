import { SubCategoryController } from "../controllers/subCategory";
import { SubCategoryRepository } from "../repositories/interfaces/subCategory";
import { MongoSubCategoryRepository } from "../repositories/mongoSubCategory";
import { CategoryQuery } from "../services/interfaces/category";
import { SubCategoryService } from "../services/subCategory";
import { azureStorageService } from "../services/azureStorage";
import { categoryService } from "./category";
import { imageService } from "./imageProcessor";
const mongoSubcategoryRespository: SubCategoryRepository =
  new MongoSubCategoryRepository();
const categoryQuery: CategoryQuery = categoryService;
export const subCategoryService = new SubCategoryService(
  mongoSubcategoryRespository,
  categoryQuery,
  imageService,
);
export const subCategoryController = new SubCategoryController(
  subCategoryService,
);
