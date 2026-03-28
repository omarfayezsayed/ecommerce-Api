import { StatusCodes } from "http-status-codes";
import { ICreateProduct } from "../../models/product2";
import { apiError } from "../../utils/apiError";
import { ProductValidator } from "./interfaces/productValidator";

// validators/simpleProductValidator.ts
export class SimpleProductValidator implements ProductValidator {
  validate(data: ICreateProduct): void {
    if (!data.price || data.stock === undefined || data.stock < 0)
      throw new apiError(
        "Simple product must have price and stock",
        StatusCodes.BAD_REQUEST,
      );

    if (data.variants?.length || data.sizes?.length)
      throw new apiError(
        "Simple product cannot have variants or sizes",
        StatusCodes.BAD_REQUEST,
      );
  }
}
