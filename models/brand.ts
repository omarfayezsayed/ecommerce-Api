import mongoose, { Schema, Document } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
export interface Ibrand {
  name?: string;
  id: string;
  slug?: string;
  image?: string;
  blobName?: string;
  createdAt: Date;
  updateAt: Date;
}

export interface brandDocument extends Ibrand {}
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
  blobName: {
    type: String,
  },
  image: {
    type: String,
    unique: true,
    sparse: true,
  },
});

// brandSchema.plugin(uniqueValidator, {
//   message: "already exists",
// });
export const Brand = mongoose.model<brandDocument>("Brand", brandSchema);
