import { ProductController } from "../controllers/product";
import { ProductRepository } from "../repositories/interfaces/product";
import { BrandRepository } from "../repositories/interfaces/brand";
import { CategoryRepository } from "../repositories/interfaces/category";
import { SubCategoryRepository } from "../repositories/interfaces/subCategory";

import { MongoProductRepository } from "../repositories/mongoProduct";
import { MongoBrandRepository } from "../repositories/mongoBrand";
import { MongoCategoryRepository } from "../repositories/mongoCategory";
import { MongoSubCategoryRepository } from "../repositories/mongoSubCategory";

import { ProductService } from "../services/product";
import { BrandQuery } from "../services/interfaces/brand";
import { CategoryQuery } from "../services/interfaces/category";
import { subCategoryQuery } from "../services/interfaces/subcategory";
import { BrandService } from "../services/brand";
import { CategoryService } from "../services/category";
import { SubCategoryService } from "../services/subCategory";

// repos
const mongoProductRepository: ProductRepository = new MongoProductRepository();
const mongoBrandRepository: BrandRepository = new MongoBrandRepository();
const mongoCategoryRepository: CategoryRepository =
  new MongoCategoryRepository();
const mongoSubcategoryRespository: SubCategoryRepository =
  new MongoSubCategoryRepository();

const brandService: BrandQuery = new BrandService(mongoBrandRepository);
const categoryService: CategoryQuery = new CategoryService(
  mongoCategoryRepository
);

const subCategoryService: subCategoryQuery = new SubCategoryService(
  mongoSubcategoryRespository,
  categoryService
);

const productService = new ProductService(
  mongoProductRepository,
  brandService,
  categoryService,
  subCategoryService
);
export const productController = new ProductController(productService);
