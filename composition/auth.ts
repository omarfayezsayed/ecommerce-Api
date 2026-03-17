import { AuthController } from "../controllers/auth";
import { UserController } from "../controllers/user";
import { AuthService } from "../services/auth";
import { IAuthUser } from "../services/interfaces/iAuthUser";
import { userService as AuthUserService } from "./user";
import { emailService } from "./email";
import { redisService } from "./redis";
export const userService: IAuthUser = AuthUserService;

const authService = new AuthService(userService, emailService, redisService);

export const authController = new AuthController(authService);
