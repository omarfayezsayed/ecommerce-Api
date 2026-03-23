import { StatusCodes } from "http-status-codes";
import { UserRepository } from "../repositories/interfaces/user";
import { apiError } from "../utils/apiError";

// services/wishlist.service.ts
export class WishlistService {
  constructor(
    private readonly userRepository: UserRepository,
    // private readonly productService: IWishlistProductService,
  ) {}

  public add = async (userId: string, productId: string) => {
    // // [STEP 1] check product exists
    // const productExists = await this.productService.exists(productId);
    // if (!productExists)
    //   throw new apiError("Product not found", StatusCodes.NOT_FOUND);

    // [STEP 2] check if already in wishlist
    const alreadyAdded = await this.userRepository.isInWishlist(
      userId,
      productId,
    );
    if (alreadyAdded)
      throw new apiError(
        "Product already in wishlist",
        StatusCodes.BAD_REQUEST,
      );

    // [STEP 3] add to wishlist
    await this.userRepository.addToWishlist(userId, productId);
  };

  public remove = async (userId: string, productId: string) => {
    // check if product is in wishlist before removing
    const exists = await this.userRepository.isInWishlist(userId, productId);
    if (!exists)
      throw new apiError("Product not in wishlist", StatusCodes.NOT_FOUND);

    return await this.userRepository.removeFromWishlist(userId, productId);
  };

  public get = async (userId: string) => {
    return await this.userRepository.getWishlist(userId);
  };

  public clear = async (userId: string) => {
    return await this.userRepository.clearWishlist(userId);
  };
}
