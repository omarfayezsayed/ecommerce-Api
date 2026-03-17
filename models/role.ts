import mongoose, { Schema, Document } from "mongoose";
import { UserRole, Permission } from "../rbac/rbacConfig";

export interface IRole {
  name: UserRole;
  permissions: Permission[];
}

export interface RoleDocumnet extends IRole {}

const roleSchema = new Schema<RoleDocumnet>({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: Object.values(UserRole),
  },
  permissions: [
    {
      type: String,
      enum: Object.values(Permission),
    },
  ],
});

export const Role = mongoose.model<RoleDocumnet>("Role", roleSchema);
