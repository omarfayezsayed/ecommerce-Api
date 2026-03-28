// models/product.ts
import mongoose, { Schema, Types } from "mongoose";
import { Icategory } from "./category";
import { IsubCategory } from "./subCategory";
import { Ibrand } from "./brand";

// interfaces/IProduct.ts
export type ProductType =
  | "simple"
  | "variant"
  | "variant_with_sizes"
  | "sizes_only";

export interface ISize {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface IVariant {
  id: string;
  color: string;
  images?: string[];
  price?: number;
  stock?: number;
  sizes?: ISize[];
}

export interface IProduct2<
  TCategory = Types.ObjectId,
  TSubCategory = Types.ObjectId,
  TBrand = Types.ObjectId,
> {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: TCategory;
  subCategory?: TSubCategory;
  brand?: TBrand;
  sold: number;
  productType: ProductType;
  images?: string[];
  price?: number;
  stock?: number;
  sizes?: ISize[];
  variants?: IVariant[];
  basePrice: number;
  priceAfterDiscount?: number;
  ratingsAverage: number;
  ratingsCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateProduct {
  name: string;
  description: string;
  category: string;
  brand?: string;
  subCategory?: string;
  productType: ProductType;
  price?: number;
  stock?: number;
  sizes?: ICreateSize[];
  variants?: ICreateVariant[];
  basePrice?: number;
}

export interface ICreateVariant {
  color: string;
  images: string[];
  price?: number;
  stock?: number;
  sizes?: ICreateSize[];
}

export interface ICreateSize {
  name: string;
  price: number;
  stock: number;
}

export interface IUpdateProduct {
  name?: string;
  description?: string;
  category?: string;
  brand?: string;
  subCategory?: string;
  price?: number;
  stock?: number;
  isActive?: boolean;
}
const sizeSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
});

const variantSchema = new Schema({
  color: { type: String, required: true },
  images: [{ type: String }],
  price: { type: Number },
  stock: { type: Number },
  sizes: [sizeSchema],
});
export type populatedProduct2 = IProduct2<Icategory, IsubCategory, Ibrand>;

export interface product2Document extends IProduct2 {}
const product2Schema = new Schema<product2Document>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product must have a description"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product must be belong to category"],
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
    },
    subCategory: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
    },
    productType: {
      type: String,
      enum: ["simple", "variant", "variant_with_sizes", "sizes_only"],
      required: true,
      default: "simple",
    },
    sold: { type: Number, default: 0 },
    priceAfterDiscount: Number,
    // simple + sizes_only
    images: [{ type: String }],
    // simple only
    price: { type: Number },
    stock: { type: Number },
    // sizes_only only
    sizes: [sizeSchema],
    // variant + variant_with_sizes only
    variants: [variantSchema],
    basePrice: { type: Number },
    ratingsAverage: { type: Number, default: 0, min: 0, max: 5 },
    ratingsCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Product2 = mongoose.model<product2Document>(
  "Product2",
  product2Schema,
);
