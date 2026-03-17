import { MongoRoleRepository } from "../repositories/mongoRole";

import { RoleService } from "../services/role";

const mongoRoleRepository = new MongoRoleRepository();
export const roleService = new RoleService(mongoRoleRepository);
