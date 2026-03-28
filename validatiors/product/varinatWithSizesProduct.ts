import { StatusCodes } from "http-status-codes";
import { ICreateProduct } from "../../models/product2";
import { apiError } from "../../utils/apiError";
import { ProductValidator } from "./interfaces/productValidator";

// validators/variantWithSizesProductValidator.ts
export class VariantWithSizesProductValidator implements ProductValidator {
  validate(data: ICreateProduct): void {
    // validate no top level price/stock
    if (data.price || data.stock)
      throw new apiError(
        "Price and stock must be inside variant sizes not product",
        StatusCodes.BAD_REQUEST,
      );

    // validate no top level sizes
    if (data.sizes?.length)
      throw new apiError(
        "Sizes must be inside variants not product",
        StatusCodes.BAD_REQUEST,
      );

    // validate variants array exists
    if (!data.variants || data.variants.length === 0)
      throw new apiError(
        "Variant product must have at least one variant",
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

      // must not have price/stock at variant level
      if (v.price || v.stock)
        throw new apiError(
          `Price and stock must be inside sizes not variant ${v.color}`,
          StatusCodes.BAD_REQUEST,
        );

      // must have sizes array
      if (!v.sizes || v.sizes.length === 0)
        throw new apiError(
          `Each variant must have at least one size at variant ${v.color}`,
          StatusCodes.BAD_REQUEST,
        );

      // validate no duplicate sizes within variant
      const sizeNames = v.sizes.map((s) => s.name.trim().toLowerCase());
      const duplicateSizes = sizeNames.filter(
        (name, index) => sizeNames.indexOf(name) !== index,
      );
      if (duplicateSizes.length > 0)
        throw new apiError(
          `Duplicate sizes found in variant ${v.color}: ${duplicateSizes.join(", ")}`,
          StatusCodes.BAD_REQUEST,
        );

      // validate each size inside variant
      v.sizes.forEach((size) => {
        if (!size.name)
          throw new apiError(
            `Size name is required in variant ${v.color}`,
            StatusCodes.BAD_REQUEST,
          );

        if (!size.price || size.price <= 0)
          throw new apiError(
            `Price must be greater than 0 at size ${size.name} in variant ${v.color}`,
            StatusCodes.BAD_REQUEST,
          );

        if (size.stock === undefined || size.stock < 0)
          throw new apiError(
            `Stock cannot be negative at size ${size.name} in variant ${v.color}`,
            StatusCodes.BAD_REQUEST,
          );
      });
    });
  }
}
