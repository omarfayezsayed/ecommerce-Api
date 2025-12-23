import { CategoryController } from "../controllers/category";
import { CategoryRepository } from "../repositories/interfaces/category";
import { MongoCategoryRepository } from "../repositories/mongoCategory";
import { CategoryService } from "../services/category";

const mongocategoryRespository: CategoryRepository =
  new MongoCategoryRepository();
const categoryService = new CategoryService(mongocategoryRespository);
export const categoryController = new CategoryController(categoryService);
