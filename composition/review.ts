import { ReviewService } from "../services/review";
import { IReviewUserService } from "../services/interfaces/user";
import { IReviewProductService } from "../services/interfaces/product";
import { MongoReviewRepository } from "../repositories/mongoReview";
import { userService as UserSerivce } from "./user";
import { productService as ProductService } from "./product";
import { ReviewController } from "../controllers/review";
const userService: IReviewUserService = UserSerivce;
const productService: IReviewProductService = ProductService;
export const reviewService = new ReviewService(
  new MongoReviewRepository(),
  userService,
  productService,
);

export const reviewController = new ReviewController(reviewService);
