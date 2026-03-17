import { IRoleService } from "../services/interfaces/role";
import { roleService } from "./role";
import { createAuthorize } from "../middlewares/authorize";
const iRoleService: IRoleService = roleService;
export const authorize = createAuthorize(iRoleService);
