// validators/productValidatorFactory.ts
import { StatusCodes } from "http-status-codes";
import { ProductType } from "../../models/product2";
import { apiError } from "../../utils/apiError";
import { ProductValidator } from "./interfaces/productValidator";
import { SimpleProductValidator } from "./simpleProduct";
import { SizesOnlyProductValidator } from "./sizesOnlyProduct";
import { VariantProductValidator } from "./variantProduct";
import { VariantWithSizesProductValidator } from "./varinatWithSizesProduct";

export class ProductValidatorFactory {
  // map productType to its validator
  private static validators: Record<ProductType, ProductValidator> = {
    simple: new SimpleProductValidator(),
    sizes_only: new SizesOnlyProductValidator(),
    variant: new VariantProductValidator(),
    variant_with_sizes: new VariantWithSizesProductValidator(),
  };

  static getValidator(productType: ProductType): ProductValidator {
    const validator = this.validators[productType];
    if (!validator)
      throw new apiError("Invalid product type", StatusCodes.BAD_REQUEST);
    return validator;
  }
}
