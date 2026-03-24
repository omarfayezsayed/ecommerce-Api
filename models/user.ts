import mongoose, { Document, Schema, Types } from "mongoose";
import { UserRole } from "../utils/userRoles";
import { Iproduct } from "./product";
import { addressSchema, IAddress } from "./address";
export interface Iuser {
  id: string;
  name: string;
  slug: string;
  profileImage?: string;
  email: string;
  googleId?: string;
  password?: string;
  phone?: string;
  isVerified: boolean;
  role: UserRole;
  blobName: string;
  authProvider: "local" | "google";
  refreshToken?: string;
  refreshTokenExpiresAt?: Date;
  passwordChangedAt?: Date;
  wishList: Iproduct[];
  addresses: IAddress[];
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
      sparse: true,
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
    isVerified: {
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
    refreshToken: String,
    refreshTokenExpiresAt: Date,
    authProvider: {
      type: String,
      enum: ["local", "google"],
    },
    wishList: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    addresses: [addressSchema],
    passwordChangedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  },
);
// authProvider?: "local" | "google";
//   refreshToken?: string;
//   refreshTokenExpiresAt?: Date;
// CategorySchema.plugin(uniqueValidator, {
//   message: "should be unique",
// });
export const User = mongoose.model<userDocumnet>("User", UserSchema);
