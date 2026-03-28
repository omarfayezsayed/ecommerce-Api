import { MongoProductRepository } from "../repositories/mongoProduct2";
import { ProductService } from "../services/product2";
import { ProductController } from "../controllers/product2";
import { imageService } from "./imageProcessor";

const productRepository = new MongoProductRepository();
const productService = new ProductService(productRepository, imageService);
export const productController = new ProductController(productService);
