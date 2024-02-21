import mongoose from "mongoose";

const CategoryShema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "category must have a name"],
      unique: [true, "category name must be unique"],
      minLength: [3, "minimum length for a name of the category is 3"],
      maxLength: [15, "maximum length for a name of the category is 15"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  {
    timestamps: true,
  }
);

export const Category = mongoose.model("Category", CategoryShema);
