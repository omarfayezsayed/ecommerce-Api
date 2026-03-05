import mongoose, { Document, Types } from "mongoose";
import { UserRole } from "../utils/userRoles";

export interface Iuser {
  name: string;
  slug: string;
  profileImage?: string;
  email: string;
  googleId?: string;
  password?: string;
  phone?: string;
  isVerfied: boolean;
  role: UserRole;
  blobName: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface userDocumnet extends Iuser {}

export const UserSchema = new mongoose.Schema<userDocumnet>(
  {
    name: {
      type: String,
      required: [true, "user must have a name"],
      unique: true,
      minLength: [3, "minimum length for a name of the user is 3"],
      maxLength: [15, "maximum length for a name of the user is 15"],
    },
    slug: {
      type: String,
      lowercase: true,
    },

    profileImage: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
    },
    googleId: String,
    phone: String,
    isVerfied: {
      type: Boolean,
      required: true,
      default: false,
    },
    role: {
      type: String,
      enum: UserRole,
      required: true,
      default: UserRole.USER,
    },
  },
  {
    timestamps: true,
  },
);

// CategorySchema.plugin(uniqueValidator, {
//   message: "should be unique",
// });
export const User = mongoose.model<userDocumnet>("User", UserSchema);
