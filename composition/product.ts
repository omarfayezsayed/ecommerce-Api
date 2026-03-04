import { ProductController } from "../controllers/product";
import { ProductRepository } from "../repositories/interfaces/product";
import { MongoProductRepository } from "../repositories/mongoProduct";

import { ProductService } from "../services/product";
import { BrandQuery } from "../services/interfaces/brand";
import { CategoryQuery } from "../services/interfaces/category";
import { subCategoryQuery } from "../services/interfaces/subcategory";

import { azureStorageService } from "../services/azureStorage";
import { brandService } from "./brand";
import { categoryService } from "./category";
import { imageService } from "./imageProcessor";
import { subCategoryService } from "./subCategory";
// repos
const mongoProductRepository: ProductRepository = new MongoProductRepository();

const brandQuery: BrandQuery = brandService;

const categoryQuery: CategoryQuery = categoryService;

const subCategoryQuery: subCategoryQuery = subCategoryService;

const productService = new ProductService(
  mongoProductRepository,
  brandQuery,
  categoryQuery,
  subCategoryQuery,
  imageService,
);
export const productController = new ProductController(productService);
