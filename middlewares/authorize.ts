import { IRoleService } from "../services/interfaces/role";
import { Permission } from "../rbac/rbacConfig";
import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";
export const createAuthorize = (roleService: IRoleService) => {
  return (...requiredPermissions: Permission[]) => {
    return async (req: any, res: Response, next: NextFunction) => {
      console.log(requiredPermissions);
      console.log(req.user.role);
      try {
        const hasPermission = await roleService.hasPermissions(
          req.user.role,
          requiredPermissions,
        );

        if (!hasPermission) {
          return res
            .status(StatusCodes.FORBIDDEN)
            .json({ message: "Forbidden" });
        }

        next();
      } catch (err) {
        next(err);
      }
    };
  };
};
