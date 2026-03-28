import { StatusCodes } from "http-status-codes";
import { ICreateProduct } from "../../models/product2";
import { apiError } from "../../utils/apiError";
import { ProductValidator } from "./interfaces/productValidator";

// validators/variantProductValidator.ts
export class VariantProductValidator implements ProductValidator {
  validate(data: ICreateProduct): void {
    // validate no top level price/stock
    if (data.price || data.stock)
      throw new apiError(
        "Price and stock must be inside variants not product",
        StatusCodes.BAD_REQUEST,
      );

    // validate variants array exists
    if (!data.variants || data.variants.length === 0)
      throw new apiError(
        "Variant product must have at least one variant",
        StatusCodes.BAD_REQUEST,
      );

    // validate no top level sizes
    if (data.sizes?.length)
      throw new apiError(
        "Variant product cannot have top level sizes",
        StatusCodes.BAD_REQUEST,
      );

    // validate no duplicate colors
    const colors = data.variants.map((v) => v.color.trim().toLowerCase());
    const duplicates = colors.filter(
      (color, index) => colors.indexOf(color) !== index,
    );
    if (duplicates.length > 0)
      throw new apiError(
        `Duplicate colors found: ${duplicates.join(", ")}`,
        StatusCodes.BAD_REQUEST,
      );

    // validate each variant
    data.variants.forEach((v, index) => {
      // must have color
      if (!v.color)
        throw new apiError(
          `Color is required at variant ${index}`,
          StatusCodes.BAD_REQUEST,
        );

      // must have price
      if (!v.price || v.price <= 0)
        throw new apiError(
          `Price must be greater than 0 at variant ${v.color}`,
          StatusCodes.BAD_REQUEST,
        );

      // must have stock
      if (v.stock === undefined || v.stock < 0)
        throw new apiError(
          `Stock cannot be negative at variant ${v.color}`,
          StatusCodes.BAD_REQUEST,
        );

      // must not have sizes
      if (v.sizes?.length)
        throw new apiError(
          `Variant product cannot have sizes inside variant ${v.color}`,
          StatusCodes.BAD_REQUEST,
        );
    });
  }
}
