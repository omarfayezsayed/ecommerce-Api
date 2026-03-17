import { Role, RoleDocumnet } from "../models/role";
import { Permission } from "../rbac/rbacConfig";
import { RoleRepository } from "./interfaces/role";

export class MongoRoleRepository implements RoleRepository {
  async findByname(name: string): Promise<RoleDocumnet | null> {
    const role = await Role.findOne({ name });
    if (!role) return null;
    return role;
  }
}
