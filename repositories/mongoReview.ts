import { reviewDocument, Review, Ireview } from "../models/review";

import { ReviewRepository } from "./interfaces/review";

import { queryBuilder } from "../utils/queryBuilder";
import mongoose from "mongoose";
export class MongoReviewRepository implements ReviewRepository {
  constructor() {}
  async calcRatings(
    productId: string,
  ): Promise<{ avgRatings: number; ratingsQuantity: number }> {
    const result = await Review.aggregate<{
      avgRatings: number;
      ratingsQuantity: number;
    }>([
      { $match: { product: new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: productId,
          avgRatings: { $avg: "$ratings" },
          ratingsQuantity: { $sum: 1 },
        },
      },
    ]);
    if (result.length) {
      result[0].avgRatings = Number(result[0].avgRatings.toFixed(1));
    }
    return result[0] ?? { avgRating: 0, ratingsQuantity: 0 };
  }
  public createOne = async (
    data: Partial<Ireview>,
  ): Promise<reviewDocument> => {
    return await Review.create(data);
  };
  public findAll = async (
    id?: string,
    queryObj?: any,
  ): Promise<Array<reviewDocument>> => {
    let filter = Review.find();
    if (id) filter = Review.find({ product: id });
    const query = new queryBuilder(filter, queryObj)
      .sort()
      .fieldlimits()
      .pagination()
      .filter()
      .build();
    return await query;
  };

  public findOne = async (id: string): Promise<reviewDocument | null> => {
    const review = await Review.findById(id);

    return review;
  };
  public updateOne = async (
    id: string,
    data: Partial<Ireview>,
  ): Promise<reviewDocument | null> => {
    const review = await Review.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    return review;
  };
  public deleteOne = async (id: string): Promise<reviewDocument | null> => {
    const review = await Review.findByIdAndDelete(id);

    return review;
  };
}
