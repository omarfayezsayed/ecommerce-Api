import { StatusCodes } from "http-status-codes";
import { ICreateProduct } from "../../models/product2";
import { apiError } from "../../utils/apiError";
import { ProductValidator } from "./interfaces/productValidator";

// validators/sizesOnlyProductValidator.ts
export class SizesOnlyProductValidator implements ProductValidator {
  validate(data: ICreateProduct): void {
    // validate sizes array exists
    if (!data.sizes || data.sizes.length === 0)
      throw new apiError(
        "Sizes only product must have at least one size",
        StatusCodes.BAD_REQUEST,
      );

    // validate no variants
    if (data.variants?.length)
      throw new apiError(
        "Sizes only product cannot have variants",
        StatusCodes.BAD_REQUEST,
      );

    // validate no top level price/stock
    if (data.price || data.stock)
      throw new apiError(
        "Price and stock must be inside sizes",
        StatusCodes.BAD_REQUEST,
      );

    // validate each size
    data.sizes.forEach((size, index) => {
      if (!size.name)
        throw new apiError(
          `Size name is required at index ${index}`,
          StatusCodes.BAD_REQUEST,
        );

      if (!size.price || size.price <= 0)
        throw new apiError(
          `Price must be greater than 0 at size ${size.name}`,
          StatusCodes.BAD_REQUEST,
        );

      if (size.stock === undefined || size.stock < 0)
        throw new apiError(
          `Stock cannot be negative at size ${size.name}`,
          StatusCodes.BAD_REQUEST,
        );
    });

    // validate no duplicate sizes
    const sizeNames = data.sizes.map((s) => s.name.trim().toLowerCase());
    const duplicates = sizeNames.filter(
      (name, index) => sizeNames.indexOf(name) !== index,
    );
    if (duplicates.length > 0)
      throw new apiError(
        `Duplicate sizes found: ${duplicates.join(", ")}`,
        StatusCodes.BAD_REQUEST,
      );
  }
}
