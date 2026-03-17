import { Permission } from "../../rbac/rbacConfig";

export interface IRoleService {
  hasPermissions(name: string, permissions: Permission[]): Promise<boolean>;
}
