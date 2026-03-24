// composition/address.ts
import { UserRepository } from "../repositories/interfaces/user";
import { AddressService } from "../services/address";
import { AddressController } from "../controllers/address";
import { MongoUserRepository } from "../repositories/mongoUser";

const userRepository: UserRepository = new MongoUserRepository();
const addressService = new AddressService(userRepository);

export const addressController = new AddressController(addressService);
