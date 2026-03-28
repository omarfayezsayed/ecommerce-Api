import mongoose, { Schema, Types, InferSchemaType } from "mongoose";

const CartItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },

    // Optional snapshot fields (useful if product price/name changes later)
    priceAtAdd: { type: Number, min: 0 },
    nameAtAdd: { type: String, trim: true },
    imageAtAdd: { type: String, trim: true },
  },
  { _id: false },
);

const CartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    items: { type: [CartItemSchema], default: [] },

    // Optional totals (can be computed on the fly; keep if you want faster reads)
    subtotal: { type: Number, min: 0, default: 0 },
    discountTotal: { type: Number, min: 0, default: 0 },
    taxTotal: { type: Number, min: 0, default: 0 },
    shippingTotal: { type: Number, min: 0, default: 0 },
    grandTotal: { type: Number, min: 0, default: 0 },

    currency: { type: String, default: "USD", trim: true },

    status: {
      type: String,
      enum: ["active", "converted", "abandoned"],
      default: "active",
      index: true,
    },

    expiresAt: { type: Date, index: true }, // optional TTL handling (set TTL index separately if needed)
  },
  { timestamps: true },
);

// Ensure 1 active cart per user (optional but common)
CartSchema.index(
  { user: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "active" } },
);

export type Cart = InferSchemaType<typeof CartSchema> & { _id: Types.ObjectId };

const CartModel = mongoose.models.Cart || mongoose.model("Cart", CartSchema);
export default CartModel;
export { CartSchema };
