import express from "express";
import { reviewController, reviewService } from "../composition/review";
import { validationHandler } from "../middlewares/validationHandler";
import { updateReviewDto } from "../dto/reviewDto/reviewRequestDto";
import { isOwner } from "../middlewares/isOwner";
import passport from "../middlewares/passport/PassportRegister";

export const reviewRouter = express.Router({ mergeParams: true });
const find = async (id: string) => {
  const review = await reviewService.getReview(id);
  const userId = review.user as string;
  return { user: userId };
};
reviewRouter
  .route("/")
  .post(reviewController.createReview)
  .get(reviewController.getAllReviews);

reviewRouter
  .route("/:id")
  .delete(
    passport.authenticate("jwt", { session: false, failWithError: true }),
    isOwner(find),
    reviewController.deleteReview,
  )
  .get(reviewController.getReview)
  .patch(
    passport.authenticate("jwt", { session: false, failWithError: true }),
    isOwner(find),
    validationHandler(updateReviewDto),
    reviewController.updateReview,
  );
