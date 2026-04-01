import mongoose, {
  Schema,
  Types,
  HydratedDocument,
  InferSchemaType,
} from "mongoose";

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered";
export type PaymentMethod = "cash" | "card";

export interface IOrderItem {
  product: Types.ObjectId;
  quantity: number;
  price: number;
  variantId?: Types.ObjectId;
  sizeId?: Types.ObjectId;
}

export interface IOrder {
  user: Types.ObjectId;
  items: IOrderItem[];
  shippingPrice: number;
  taxAmount: number;
  totalOrderPrice: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  coupon?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product2", required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  variantId: { type: Schema.Types.ObjectId },
  sizeId: { type: Schema.Types.ObjectId },
});

const OrderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [OrderItemSchema], default: [] },
    shippingPrice: { type: Number, required: true },
    taxAmount: { type: Number, required: true },
    totalOrderPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered"],
      default: "confirmed",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card"],
      required: true,
    },
    isPaid: { type: Boolean, default: false },
    coupon: { type: String },
  },
  { timestamps: true },
);

export type OrderSchemaType = InferSchemaType<typeof OrderSchema> & {
  _id: Types.ObjectId;
};
export type OrderDocument = HydratedDocument<OrderSchemaType>;
export const OrderModel = mongoose.model<OrderSchemaType>("Order", OrderSchema);
