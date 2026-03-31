import express from "express";
import { reviewController, reviewService } from "../composition/review";
import { validationHandler } from "../middlewares/validationHandler";
import {
  createReviewDto,
  updateReviewDto,
} from "../dto/reviewDto/reviewRequestDto";
import { isOwner } from "../middlewares/isOwner";
import passport from "../middlewares/passport/PassportRegister";
import { idParamDto } from "../dto/utils/idDto";
import { authorize } from "../composition/rbac";
import { Permission } from "../rbac/rbacConfig";

export const reviewRouter = express.Router({ mergeParams: true });
// const find = async (id: string) => {
//   const review = await reviewService.getReview(id);
//   const userId = review.user as string;
//   return { user: userId };
// };
reviewRouter
  .route("/")
  .post(
    passport.authenticate("jwt", { session: false, failWithError: true }),
    authorize(Permission.CREATE_REVIEW),
    validationHandler(createReviewDto),
    reviewController.createReview,
  )
  .get(reviewController.getAllReviews);

reviewRouter
  .route("/:id")
  .delete(
    passport.authenticate("jwt", { session: false, failWithError: true }),
    authorize(Permission.DELETE_REVIEW),
    validationHandler(idParamDto, "params"),
    reviewController.deleteReview,
  )
  .get(validationHandler(idParamDto, "params"), reviewController.getReview)
  .patch(
    passport.authenticate("jwt", { session: false, failWithError: true }),
    authorize(Permission.UPDATE_REVIEW),
    validationHandler(idParamDto, "params"),
    validationHandler(updateReviewDto),
    reviewController.updateReview,
  );
