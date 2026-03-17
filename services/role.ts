import { Permission } from "../rbac/rbacConfig";
import { RoleRepository } from "../repositories/interfaces/role";
import { IRoleService } from "./interfaces/role";

export class RoleService implements IRoleService {
  private repo: RoleRepository;

  constructor(repo: RoleRepository) {
    this.repo = repo;
  }
  async hasPermissions(
    roleName: string,
    requiredRermissions: Permission[],
  ): Promise<boolean> {
    const role = await this.repo.findByname(roleName);
    if (!role) return false;
    return requiredRermissions.every((permission) =>
      role.permissions.includes(permission),
    );
  }
}
