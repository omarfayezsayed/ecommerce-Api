import { WishlistService } from "../services/wishList";

import { UserRepository } from "../repositories/interfaces/user";
import { MongoUserRepository } from "../repositories/mongoUser";
import { WishlistController } from "../controllers/wishList";

const userRepo: UserRepository = new MongoUserRepository();
const wishListService = new WishlistService(userRepo);

export const wishListController = new WishlistController(wishListService);
