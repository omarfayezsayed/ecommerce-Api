import { RoleDocumnet } from "../../models/role";
import { Permission } from "../../rbac/rbacConfig";

export interface RoleRepository {
  findByname(name: string): Promise<RoleDocumnet | null>;
}
