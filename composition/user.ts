import { UserController } from "../controllers/user";
import { UserRepository } from "../repositories/interfaces/user";
import { MongoUserRepository } from "../repositories/mongoUser";
import { UserService } from "../services/user";
import { imageService } from "./imageProcessor";
const mongoUserRepository = new MongoUserRepository();

export const userService = new UserService(mongoUserRepository, imageService);
export const userController = new UserController(userService);
