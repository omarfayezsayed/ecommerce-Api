// import uniqueValidator from "mongoose-unique-validator";
import mongoose, { Document } from "mongoose";
import { categoryDocumnet } from "./category";
import { subCategoryDocument } from "./subCategory";
import { brandDocument } from "./brand";

export interface product {
  title: string;
  slug: string;
  quantity: number;
  sold: number;
  price: number;
  description: string;
  category: categoryDocumnet | mongoose.Types.ObjectId;
  subCategory?: subCategoryDocument | mongoose.Types.ObjectId;
  brand?: brandDocument | mongoose.Types.ObjectId;
  priceAfterDiscount?: number;
  ratingsAverage?: number;
  ratingsQuantity?: number;
  images?: [string];
  imageCover: string;
  colors?: [string];
  createdAt: Date;
  updatedAt: Date;
}
export interface productDocumnet extends product, Document {}

export const ProductSchema = new mongoose.Schema<productDocumnet>(
  {
    title: {
      type: String,
      required: [true, "brand must have a title"],
      unique: true,
      minLength: [5, "minimum length for a name of the product is 3"],
      maxLength: [100, "maximum length for a name of the product is 15"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    images: [String],
    imageCover: {
      type: String,
      required: [true, "product must have an image cover"],
    },
    quantity: {
      type: Number,
      required: [true, "product must have an inital quantity"],
    },

    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "product must have a price"],
      max: [100000, "price is very high"],
    },
    description: {
      type: String,
      required: [true, "product must have a description"],
    },
    priceAfterDiscount: Number,
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above or equal 1.0"],
      max: [5, "Rating must be below or equal 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    colors: [String],
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: [true, "product must belong to category"],
    },
    brand: {
      type: mongoose.Types.ObjectId,
      ref: "Brand",
    },
    subCategory: {
      type: mongoose.Types.ObjectId,
      ref: "SubCategory",
    },
  },
  {
    timestamps: true,
  }
);

// ProductSchema.plugin(uniqueValidator, {
//   message: "should be unique",
// });
export const Product = mongoose.model<productDocumnet>(
  "Product",
  ProductSchema
);

//     "title": "White Gold Plated Princess",
//     "slug": "white-gold-plated-princess",
//     "quantity": 33,
//     "sold": 99,
//     "price": 9.99,
//     "description": "Classic Created Wedding Engagement Solitaire Diamond Promise Ring for Her. Gifts to spoil your love more for Engagement, Wedding, Anniversary, Valentine's Day...",
//     "category": "61b2a8dd4bad61f4cc4a98ea",
//     "imageCover": "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg",
//     "ratingsAverage": 2.8,
//     "ratingsQuantity": 76
