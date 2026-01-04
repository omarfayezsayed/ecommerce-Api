import mongoose, { Schema, Document } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
export interface brand {
  name: string;
  slug: string;
  image?: string;
  createdAt: Date;
  updateAt: Date;
}

export interface brandDocument extends brand, Document {}
const brandSchema = new Schema<brandDocument>({
  name: {
    type: String,
    required: [true, "brand must have a name"],
    unique: true,
    minLength: [3, "minimum length for a name of the brand is 3"],
    maxLength: [15, "maximum length for a name of the brand is 15"],
  },
  slug: {
    type: String,
    lowercase: true,
  },
  image: {
    type: String,
    unique: true,
  },
});

// brandSchema.plugin(uniqueValidator, {
//   message: "already exists",
// });
export const Brand = mongoose.model<brandDocument>("Brand", brandSchema);
