import mongoose from "mongoose";

// export interface Subcategory {
//   name: string;
//   name
// }
const subCategorySchema = new mongoose.Schema(
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
    image: String,
    category: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Category",
      required: [true, "SubCategory must have main category"],
    },
  },
  {
    timestamps: true,
  }
);

export const Subcategory = mongoose.model("subCategory", subCategorySchema);
