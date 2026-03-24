import mongoose from "mongoose";

export interface ICoupon {
  id: string;
  name: string;
  expire: Date;
  discount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface couponDocumnet extends ICoupon {}
const couponSchema = new mongoose.Schema<couponDocumnet>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Coupon name required"],
      unique: true,
    },
    expire: {
      type: Date,
      required: [true, "Coupon expire time required"],
    },
    discount: {
      type: Number,
      required: [true, "Coupon discount value required"],
    },
  },
  { timestamps: true },
);

export const Coupon = mongoose.model<couponDocumnet>("Coupon", couponSchema);
