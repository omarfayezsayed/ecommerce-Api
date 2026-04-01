import { StatusCodes } from "http-status-codes";
import { ClientSession } from "mongoose";
import { MongoProductRepository } from "../repositories/mongoProduct2";
import { ImageService } from "./imageService";
import { apiError } from "../utils/apiError";
import {
  ICreateProduct,
  ICreateSize,
  ICreateVariant,
  IUpdateProduct,
  ProductType,
} from "../models/product2";
import { ProductValidatorFactory } from "../validatiors/product/productValidatorFactory";
import { StorageFolder } from "../utils/storageFolder";
import { BrandQuery } from "./interfaces/brand";
import { CategoryQuery } from "./interfaces/category";
import { subCategoryQuery } from "./interfaces/subcategory";

// Centralized error messages for consistency
const ERRORS = {
  NOT_FOUND: "Product not found",
  PRODUCT_IMAGES_NOT_ALLOWED:
    "Only simple and sizes_only products have product level images",
  SIZES_ONLY: "Only sizes_only products support this operation",
  VARIANT_ONLY: "Only variant products support this operation",
  VARIANT_WITH_SIZES_ONLY:
    "Only variant_with_sizes products support this operation",
  SIZE_EXISTS: "Size already exists",
  SIZE_MIN: "Product must have at least one size",
  SIZE_NOT_FOUND: "Size not found",
  VARIANT_EXISTS: "Color already exists",
  VARIANT_MIN: "Product must have at least one variant",
  VARIANT_NOT_FOUND: "Variant not found",
  VARIANT_SIZE_EXISTS: "Size already exists in this variant",
} as const;

type AllowedType = Extract<
  ProductType,
  "simple" | "variant" | "variant_with_sizes" | "sizes_only"
>;
export class ProductService {
  constructor(
    private productRepository: MongoProductRepository,
    private imageService: ImageService,
    private brandQuery: BrandQuery,
    private categoryQuery: CategoryQuery,
    private subCategoryQuery: subCategoryQuery,
  ) {}

  // ── Internal helpers (kept in-file) ─────────────────────────────────────
  private async loadProductOrThrow(id: string) {
    const product = await this.productRepository.findById(id);
    if (!product) throw new apiError(ERRORS.NOT_FOUND, StatusCodes.NOT_FOUND);
    return product;
  }

  private assertType(
    product: { productType: ProductType },
    allowed: AllowedType[],
  ) {
    if (allowed.includes(product.productType as AllowedType)) return;

    const describeAllowed = () => {
      if (allowed.length === 0) return "Operation not allowed";
      if (allowed.length === 1) {
        const only = allowed[0];
        if (only === "simple")
          return "Only simple products support this operation";
        if (only === "sizes_only") return ERRORS.SIZES_ONLY;
        if (only === "variant_with_sizes")
          return ERRORS.VARIANT_WITH_SIZES_ONLY;
        return ERRORS.VARIANT_ONLY;
      }
      // Multiple allowed types; list them
      const labels = allowed.map((t) => t.replace(/_/g, " "));
      return `Only ${labels.join(" or ")} products support this operation`;
    };

    throw new apiError(describeAllowed(), StatusCodes.BAD_REQUEST);
  }

  private ensureHasVariants(product: any) {
    if (!product.variants || product.variants.length < 1)
      throw new apiError(ERRORS.VARIANT_MIN, StatusCodes.BAD_REQUEST);
  }

  private ensureHasSizes(sizes: any[]) {
    if (!sizes || sizes.length < 1)
      throw new apiError(ERRORS.SIZE_MIN, StatusCodes.BAD_REQUEST);
  }

  private findVariantOrThrow(product: any, variantId: string) {
    const variant = product.variants?.find((v: any) => v.id === variantId);
    if (!variant)
      throw new apiError(ERRORS.VARIANT_NOT_FOUND, StatusCodes.NOT_FOUND);
    return variant;
  }

  private findSizeOrThrow(sizes: any[], sizeId: string) {
    const size = sizes?.find((s: any) => s.id === sizeId);
    if (!size) throw new apiError(ERRORS.SIZE_NOT_FOUND, StatusCodes.NOT_FOUND);
    return size;
  }

  private ensureUniqueColor(product: any, color: string, currentId?: string) {
    const exists = product.variants?.some(
      (v: any) => v.color === color && (!currentId || v.id !== currentId),
    );
    if (exists)
      throw new apiError(ERRORS.VARIANT_EXISTS, StatusCodes.BAD_REQUEST);
  }

  private ensureUniqueSize(sizes: any[], name: string, currentId?: string) {
    const exists = sizes?.some(
      (s: any) =>
        s.name.trim().toLowerCase() === name.trim().toLowerCase() &&
        (!currentId || s.id !== currentId),
    );
    if (exists)
      throw new apiError(ERRORS.VARIANT_SIZE_EXISTS, StatusCodes.BAD_REQUEST);
  }

  private checkCategoryExists = async (categoryId: string) => {
    const exists = await this.categoryQuery.existsById(categoryId);
    if (!exists)
      throw new apiError("Category does not exist", StatusCodes.NOT_FOUND);
  };

  private checkBrandExists = async (brandId: string) => {
    const exists = await this.brandQuery.existsById(brandId);
    if (!exists)
      throw new apiError("Brand does not exist", StatusCodes.NOT_FOUND);
  };

  private checkSubCategoryExists = async (subCategoryId: string) => {
    const exists = await this.subCategoryQuery.existsById(subCategoryId);
    if (!exists)
      throw new apiError("SubCategory does not exist", StatusCodes.NOT_FOUND);
  };
  private checkthatSubCategoryBelongsToCategory = async (
    subCategoryId: string,
    categoryId: string,
  ) => {
    const subCategory = await this.subCategoryQuery.existsById(subCategoryId);
    if (!subCategory)
      throw new apiError("SubCategory does not exist", StatusCodes.NOT_FOUND);
    console.log(subCategory.category.toString(), "---------------", categoryId);
    if (subCategory.category.toString() !== categoryId)
      throw new apiError(
        "SubCategory does not belong to the specified category",
        StatusCodes.BAD_REQUEST,
      );
  };
  //  simple crud
  public getAll = async () => {
    return await this.productRepository.findAll();
  };

  public getById = async (id: string) => {
    return await this.loadProductOrThrow(id);
  };
  public create = async (data: ICreateProduct) => {
    // factory pattern to get the right validator based on productType
    const validator = ProductValidatorFactory.getValidator(data.productType);
    validator.validate(data);

    const promises = [this.checkCategoryExists(data.category)];
    if (data.brand) promises.push(this.checkBrandExists(data.brand));
    if (data.subCategory) {
      promises.push(this.checkSubCategoryExists(data.subCategory));
      promises.push(
        this.checkthatSubCategoryBelongsToCategory(
          data.subCategory,
          data.category,
        ),
      );
    }
    await Promise.all(promises);
    return await this.productRepository.create(data);
  };

  public update = async (id: string, data: IUpdateProduct) => {
    const product = await this.loadProductOrThrow(id);
    if (data.stock !== undefined || data.price !== undefined)
      this.assertType(product, ["simple"]);
    return await this.productRepository.update(id, data);
  };
  public delete = async (id: string) => {
    const deleted = await this.productRepository.delete(id);
    if (!deleted) throw new apiError(ERRORS.NOT_FOUND, StatusCodes.NOT_FOUND);
    return deleted;
  };

  addImages = async (productId: string, files: Express.Multer.File[]) => {
    const product = await this.loadProductOrThrow(productId);
    this.assertType(product, ["simple", "sizes_only"]);
    const imageBlobNames = await this.uploadImages(files);
    return await this.productRepository.addImages(productId, imageBlobNames);
  };

  addImagestoVariant = async (
    productId: string,
    variantId: string,
    files: Express.Multer.File[],
  ) => {
    const product = await this.loadProductOrThrow(productId);
    this.assertType(product, ["variant", "variant_with_sizes"]);
    this.findVariantOrThrow(product, variantId);
    const imageBlobNames = await this.uploadImages(files);
    return await this.productRepository.addVariantImages(
      productId,
      variantId,
      imageBlobNames,
    );
  };

  public addSizeToProduct = async (productId: string, data: ICreateSize) => {
    const product = await this.loadProductOrThrow(productId);
    this.assertType(product, ["sizes_only"]);
    this.ensureUniqueSize(product.sizes || [], data.name);

    return await this.productRepository.addSizeToProduct(productId, data);
  };
  public updateProductSize = async (
    productId: string,
    sizeId: string,
    data: Partial<ICreateSize>,
  ) => {
    const product = await this.loadProductOrThrow(productId);
    this.assertType(product, ["sizes_only"]);
    const size = this.findSizeOrThrow(product.sizes || [], sizeId);
    if (data.name && data.name !== size.name)
      this.ensureUniqueSize(product.sizes || [], data.name, sizeId);
    return await this.productRepository.updateProductSize(
      productId,
      sizeId,
      data,
    );
  };
  public deleteProductSize = async (productId: string, sizeId: string) => {
    const product = await this.loadProductOrThrow(productId);
    this.assertType(product, ["sizes_only"]);
    this.ensureHasSizes(product.sizes || []);
    this.findSizeOrThrow(product.sizes || [], sizeId);

    return await this.productRepository.deleteProductSize(productId, sizeId);
  };
  //  variant products
  public addVariant = async (productId: string, data: ICreateVariant) => {
    const product = await this.loadProductOrThrow(productId);
    this.assertType(product, ["variant", "variant_with_sizes"]);
    if (data.sizes && data.sizes.length) {
      this.assertType(product, ["variant_with_sizes"]);
    }
    this.ensureUniqueColor(product, data.color);
    this.validateVariant(product.productType, data);

    return await this.productRepository.addVariant(productId, data);
  };

  public updateVariant = async (
    productId: string,
    variantId: string,
    data: Partial<ICreateVariant>,
  ) => {
    const product = await this.loadProductOrThrow(productId);
    this.assertType(product, ["variant", "variant_with_sizes"]);
    const variant = this.findVariantOrThrow(product, variantId);

    if (data.price !== undefined || data.stock !== undefined) {
      this.assertType(product, ["variant"]);
    }

    if (data.color && data.color !== variant.color)
      this.ensureUniqueColor(product, data.color, variantId);
    console.log(data, productId, variantId);
    return await this.productRepository.updateVariant(
      productId,
      variantId,
      data,
    );
  };

  public deleteVariant = async (productId: string, variantId: string) => {
    const product = await this.loadProductOrThrow(productId);
    this.assertType(product, ["variant", "variant_with_sizes"]);
    this.ensureHasVariants(product);
    const variant = this.findVariantOrThrow(product, variantId);

    // delete variant images from azure
    if (variant.images && variant.images.length > 0)
      await Promise.all(
        variant.images.map((img: any) =>
          this.imageService.deleteByBlobName(img),
        ),
      );

    return await this.productRepository.deleteVariant(productId, variantId);
  };

  //   public updateVariantImages = async (productId: string, variantId: string) => {
  //     const product = await this.productRepository.findById(productId);
  //     if (!product)
  //       throw new apiError("Product not found", StatusCodes.NOT_FOUND);

  //     const variant = product.variants?.find((v) => v.id === variantId);
  //     if (!variant)
  //       throw new apiError("Variant not found", StatusCodes.NOT_FOUND);

  //     // delete old images
  //     await Promise.all(
  //       variant.images.map((img) => this.imageService.deleteByBlobName(img)),
  //     );

  //     const newImages = await this.uploadImages(files);
  //     return await this.productRepository.updateVariantImages(
  //       productId,
  //       variantId,
  //       newImages,
  //     );
  //   };

  // ─── VARIANT SIZES ────────────────────────────────────────────────────────

  public addVariantSize = async (
    productId: string,
    variantId: string,
    data: ICreateSize,
  ) => {
    const product = await this.loadProductOrThrow(productId);
    this.assertType(product, ["variant_with_sizes"]);
    const variant = this.findVariantOrThrow(product, variantId);
    this.ensureUniqueSize(variant.sizes || [], data.name);

    return await this.productRepository.addVariantSize(
      productId,
      variantId,
      data,
    );
  };

  public updateVariantSize = async (
    productId: string,
    variantId: string,
    sizeId: string,
    data: Partial<ICreateSize>,
  ) => {
    const product = await this.loadProductOrThrow(productId);
    this.assertType(product, ["variant_with_sizes"]);

    const variant = this.findVariantOrThrow(product, variantId);
    const size = this.findSizeOrThrow(variant.sizes || [], sizeId);
    if (data.name && data.name !== size.name)
      this.ensureUniqueSize(variant.sizes || [], data.name, sizeId);
    return await this.productRepository.updateVariantSize(
      productId,
      variantId,
      sizeId,
      data,
    );
  };

  public deleteVariantSize = async (
    productId: string,
    variantId: string,
    sizeId: string,
  ) => {
    const product = await this.loadProductOrThrow(productId);
    this.assertType(product, ["variant_with_sizes"]);

    const variant = this.findVariantOrThrow(product, variantId);
    this.findSizeOrThrow(variant.sizes || [], sizeId);
    return await this.productRepository.deleteVariantSize(
      productId,
      variantId,
      sizeId,
    );
  };

  private async uploadImages(files: Express.Multer.File[]): Promise<string[]> {
    const uploaded = await Promise.all(
      files.map((file) =>
        this.imageService.uploadFromDto(file, StorageFolder.PRODUCTS),
      ),
    );
    const imageBlobNames = uploaded.map((img) => img.blobName);
    return imageBlobNames;
  }
  private validateVariant = (
    productType: ProductType,
    variant: ICreateVariant,
  ) => {
    if (!variant.color || variant.color.trim() === "")
      throw new apiError("Variant color is required", StatusCodes.BAD_REQUEST);
    if (productType === "variant") {
      if (!variant.price || !variant.stock)
        throw new apiError(
          "Each variant must have price and stock",
          StatusCodes.BAD_REQUEST,
        );
      if (variant.sizes && variant.sizes.length > 0)
        throw new apiError(
          "Variant product cannot have sizes inside variant",
          StatusCodes.BAD_REQUEST,
        );
    }

    if (productType === "variant_with_sizes") {
      if (!variant.sizes || variant.sizes.length === 0)
        throw new apiError(
          "Each variant must have at least one size",
          StatusCodes.BAD_REQUEST,
        );
      if (variant.price || variant.stock)
        throw new apiError(
          "Price and stock must be inside sizes not variant",
          StatusCodes.BAD_REQUEST,
        );
      // write code to validate that each size has price and stock
      for (const size of variant.sizes) {
        if (!size.price || !size.stock || !size.name || size.name.trim() === "")
          throw new apiError(
            "Each size must have price and stock and name",
            StatusCodes.BAD_REQUEST,
          );
      }
      //   write code to check duplicate size names inside the variant
      const sizeNames = new Set();
      for (const size of variant.sizes) {
        const name = size.name.trim().toLowerCase();
        if (sizeNames.has(name))
          throw new apiError(
            "Duplicate size names are not allowed inside a variant",
            StatusCodes.BAD_REQUEST,
          );
        sizeNames.add(name);
      }
    }
  };

  public reserveStock = async (
    productId: string,
    quantity: number,
    variantId?: string,
    sizeId?: string,
    session?: ClientSession,
  ): Promise<boolean> => {
    return await this.productRepository.decrementStockAtomic(
      productId,
      quantity,
      variantId,
      sizeId,
      session,
    );
  };

  public releaseStock = async (
    productId: string,
    quantity: number,
    variantId?: string,
    sizeId?: string,
    session?: ClientSession,
  ): Promise<boolean> => {
    return await this.productRepository.incrementStockAtomic(
      productId,
      quantity,
      variantId,
      sizeId,
      session,
    );
  };
}
