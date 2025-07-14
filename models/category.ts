import uniqueValidator from "mongoose-unique-validator";
import mongoose, {
  Document,
  DocumentDefinition,
  Schema,
  Types,
} from "mongoose";

export interface category {
  name: string;
  slug?: string;
  image?: string;
}
export interface categoryDocumnet extends category, Document {}

export const CategorySchema = new mongoose.Schema<categoryDocumnet>(
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
    image: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// CategorySchema.plugin(uniqueValidator, {
//   message: "should be unique",
// });
export const Category = mongoose.model<categoryDocumnet>(
  "Category",
  CategorySchema
);
