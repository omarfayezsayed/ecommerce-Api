import { AuthController } from "../controllers/auth";
import { UserController } from "../controllers/user";
import { AuthService } from "../services/auth";
import { IAuthUser } from "../services/interfaces/iAuthUser";
import { userService as AuthUserService } from "./user";
export const userService: IAuthUser = AuthUserService;

const authService = new AuthService(userService);

export const authController = new AuthController(authService);
