import mongoose, { Schema, Document } from "mongoose";
import { Iuser } from "./user";
import { Iproduct } from "./product";
export interface Ireview {
  id: string;
  content: string;
  ratings: number;
  user: Iuser | string;
  product: Iproduct | string;
  createdAt: Date;
  updateAt: Date;
}

export interface reviewDocument extends Ireview {}
const reviewSchema = new Schema<reviewDocument>(
  {
    content: {
      type: String,
    },
    ratings: {
      type: Number,
      min: [0, "Min ratings value is 0"],
      max: [5, "Max ratings value is 5.0"],
      required: [true, "review ratings required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to user"],
    },
    // parent reference (one to many)
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to product"],
    },
  },
  { timestamps: true },
);

// reviewSchema.plugin(uniqueValidator, {
//   message: "already exists",
// });
export const Review = mongoose.model<reviewDocument>("Review", reviewSchema);
