import { MongoProductRepository } from "../repositories/mongoProduct2";
import { ProductService } from "../services/product2";
import { ProductController } from "../controllers/product2";
import { imageService } from "./imageProcessor";
import { BrandQuery } from "../services/interfaces/brand";
import { brandService } from "./brand";
import { categoryService } from "./category";
import { CategoryQuery } from "../services/interfaces/category";
import { subCategoryService } from "./subCategory";
import { subCategoryQuery } from "../services/interfaces/subcategory";

const brandQuery: BrandQuery = brandService;

const categoryQuery: CategoryQuery = categoryService;

const subCategoryQuery: subCategoryQuery = subCategoryService;
const productRepository = new MongoProductRepository();
export const productService = new ProductService(
  productRepository,
  imageService,
  brandQuery,
  categoryQuery,
  subCategoryQuery,
);
export const productController = new ProductController(productService);
