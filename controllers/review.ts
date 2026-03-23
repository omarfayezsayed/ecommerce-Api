import { StatusCodes } from "http-status-codes";
import {
  createReviewDto,
  updateReviewDto,
} from "../dto/reviewDto/reviewRequestDto";
import { ReviewService } from "../services/review";
import { asyncWrapper } from "../utils/asyncWrapper";
import { Request, Response } from "express";
import { queryParser } from "../utils/queryParser";
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  public createReview = asyncWrapper(async (req: Request, res: Response) => {
    const reviewData: createReviewDto = req.body;
    const review = await this.reviewService.createReview(reviewData);

    res.status(StatusCodes.CREATED).json({
      status: "success",
      data: review,
    });
  });
  public updateReview = asyncWrapper(async (req: Request, res: Response) => {
    const data: updateReviewDto = req.body;
    const review = await this.reviewService.updateReview(req.params.id!, data);

    res.status(StatusCodes.OK).json({
      status: "success",
      data: review,
    });
  });
  public getReview = asyncWrapper(async (req: Request, res: Response) => {
    const reviewId = req.params.id as string;
    const review = await this.reviewService.getReview(reviewId);

    res.status(StatusCodes.OK).json({
      status: "success",
      data: review,
    });
  });
  public getAllReviews = asyncWrapper(async (req: Request, res: Response) => {
    const parsedQuery = queryParser(req.query);
    const productId = req.params.id;
    const reviews = await this.reviewService.getAllReviews(
      parsedQuery,
      productId,
    );

    res.status(StatusCodes.OK).json({
      status: "success",
      records: reviews.length,
      data: reviews,
    });
  });
  public deleteReview = asyncWrapper(async (req: Request, res: Response) => {
    const reviewID = req.params.id as string;
    await this.reviewService.deleteReview(reviewID);

    res.status(StatusCodes.NO_CONTENT).json({
      status: "success",
    });
  });
}
