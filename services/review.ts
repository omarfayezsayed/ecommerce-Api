import { StatusCodes } from "http-status-codes";
import { ReviewInternalDto } from "../dto/reviewDto/reviewInternalDto";
import { ReviewRepository } from "../repositories/interfaces/review";
import { apiError } from "../utils/apiError";
import { IReviewProductService } from "./interfaces/product";
import { IReviewUserService } from "./interfaces/user";
import { Ireview, reviewDocument } from "../models/review";
import { updateReviewDto } from "../dto/reviewDto/reviewRequestDto";

export class ReviewService {
  private repository: ReviewRepository;
  private userSerivce: IReviewUserService;
  private productSerivce: IReviewProductService;

  constructor(
    repository: ReviewRepository,
    userService: IReviewUserService,
    productService: IReviewProductService,
  ) {
    this.repository = repository;
    this.userSerivce = userService;
    this.productSerivce = productService;
  }

  public createReview = async (data: ReviewInternalDto) => {
    const [product, user] = await Promise.all([
      this.productSerivce.exists(data.product!),
      this.userSerivce.exists(data.user!),
    ]);

    if (!product)
      throw new apiError("product does not exists", StatusCodes.NOT_FOUND);

    if (!user)
      throw new apiError("user does not exists", StatusCodes.NOT_FOUND);

    const review = await this.repository.createOne(data);
    await this.updateProductRatings(data.product!);
    return review;
  };
  public getAllReviews = async (queryObj: any, id?: string) => {
    const reviews = await this.repository.findAll(id, queryObj);
    return reviews;
  };

  public updateReview = async (id: string, data: updateReviewDto) => {
    const review = await this.repository.findOne(id);
    if (!review) throw new apiError("Review not found", StatusCodes.NOT_FOUND);

    const allowedUpdates: { ratings?: number; content?: string } = {
      ...(data.ratings && { ratings: data.ratings }),
      ...(data.content && { content: data.content }),
    };
    console.log(allowedUpdates);
    const updatedReview = await this.repository.updateOne(id, allowedUpdates);
    if (data.ratings)
      await this.updateProductRatings(updatedReview?.product as string);
    return updatedReview;
  };
  public getReview = async (reviewId: string): Promise<reviewDocument> => {
    const review = (await this.repository.findOne(
      reviewId,
    )) as unknown as reviewDocument;
    console.log("review", review);
    if (!review) {
      throw new apiError("no review with that id", StatusCodes.NOT_FOUND);
    }

    return review;
  };
  public deleteReview = async (reviewId: string) => {
    const review = await this.repository.deleteOne(reviewId);
    if (!review)
      throw new apiError("No review with that id ", StatusCodes.NOT_FOUND);
    await this.updateProductRatings(review.product as string);
  };
  private updateProductRatings = async (productId: string) => {
    console.log(productId);
    const result = await this.repository.calcRatings(productId);
    await this.productSerivce.updateRatings(
      productId,
      result.avgRatings,
      result.ratingsQuantity,
    );
  };
}
