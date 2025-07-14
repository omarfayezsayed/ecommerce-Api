import mongoose, { Schema, Document } from "mongoose";

export interface brand {
  name: string;
  slug?: string;
  image?: string;
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

export const Brand = mongoose.model<brandDocument>("brand", brandSchema);
