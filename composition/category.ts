import { CategoryController } from "../controllers/category";
import { CategoryRepository } from "../repositories/interfaces/category";
import { MongoCategoryRepository } from "../repositories/mongoCategory";
import { CategoryService } from "../services/category";
import { azureStorageService } from "../services/azureStorage";

const mongocategoryRespository: CategoryRepository =
  new MongoCategoryRepository();
const categoryService = new CategoryService(
  mongocategoryRespository,
  azureStorageService,
);
export const categoryController = new CategoryController(categoryService);
