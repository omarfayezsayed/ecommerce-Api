import mongoose, {
  Schema,
  Types,
  InferSchemaType,
  HydratedDocument,
} from "mongoose";

export interface ICartItem<TProduct = Types.ObjectId> {
  id: string;
  product: TProduct; // reference to Product2
  quantity: number;
  price: number; // snapshot of price at time of adding
  variantId?: string; // optional, for variant products
  sizeId?: string; // optional, for size-based products
}

export interface ICart {
  id: string;
  user: Types.ObjectId; // reference to User
  items: ICartItem[];
  coupon?: string;
  subTotal: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product2", required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  price: { type: Number, required: true, min: 0 },
  variantId: { type: Schema.Types.ObjectId },
  sizeId: { type: Schema.Types.ObjectId },
});

const CartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: { type: [CartItemSchema], default: [] },

    // Optional totals (can be computed on the fly; keep if you want faster reads)
    coupon: { type: String },
    subTotal: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
);

export type CartSchemaType = InferSchemaType<typeof CartSchema> & {
  _id: Types.ObjectId;
};
export type CartDocument = HydratedDocument<CartSchemaType>;

export const CartModel = mongoose.model<CartSchemaType>("Cart", CartSchema);
