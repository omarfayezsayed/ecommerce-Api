import { CategoryController } from "../controllers/category";
import { CategoryRepository } from "../repositories/interfaces/category";
import { MongoCategoryRepository } from "../repositories/mongoCategory";
import { CategoryService } from "../services/category";
import { imageService } from "./imageProcessor";

const mongocategoryRespository: CategoryRepository =
  new MongoCategoryRepository();
export const categoryService = new CategoryService(
  mongocategoryRespository,
  imageService,
);
export const categoryController = new CategoryController(categoryService);
