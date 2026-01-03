import uniqueValidator from "mongoose-unique-validator";
import mongoose, { Schema, Types, Document, Query } from "mongoose";

import { category, categoryDocumnet } from "./category";

export interface subCategory {
  name: string;
  slug: string;
  image?: string;
  category: categoryDocumnet | Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
export interface subCategoryDocument extends subCategory, Document {}
const subCategorySchema = new mongoose.Schema<subCategoryDocument>(
  {
    name: {
      type: String,
      required: [true, "category must have a name"],
      unique: true,
      minLength: [3, "minimum length for a name of the category is 3"],
      maxLength: [15, "maximum length for a name of the category is 15"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: { type: String, unique: true },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      validate: {
        validator: async function (category: any) {
          const exists = await mongoose
            .model("Category")
            .exists({ _id: category });

          return !!exists;
        },
        message: "Main category does not exist",
      },
      required: [true, "SubCategory must have main category"],
    },
  },
  {
    timestamps: true,
  }
);

subCategorySchema.pre<subCategoryDocument>(/^find/, function (next) {
  this.populate("category");
  next();
});

export const Subcategory = mongoose.model<subCategoryDocument>(
  "subCategory",
  subCategorySchema
);
