import { StatusCodes } from "http-status-codes";
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
import { url } from "inspector";
export class ProductService {
  constructor(
    private productRepository: MongoProductRepository,
    private imageService: ImageService,
  ) {}

  //  simple crud
  public getAll = async () => {
    return await this.productRepository.findAll();
  };

  public getById = async (id: string) => {
    const product = await this.productRepository.findById(id);
    if (!product)
      throw new apiError("Product not found", StatusCodes.NOT_FOUND);
    return product;
  };
  public create = async (data: ICreateProduct) => {
    // factory pattern to get the right validator based on productType
    const validator = ProductValidatorFactory.getValidator(data.productType);
    validator.validate(data);

    return await this.productRepository.create(data);
  };

  public update = async (id: string, data: IUpdateProduct) => {
    const product = await this.productRepository.findById(id);
    if (!product)
      throw new apiError("Product not found", StatusCodes.NOT_FOUND);

    return await this.productRepository.update(id, data);
  };
  public delete = async (id: string) => {
    const product = await this.productRepository.delete(id);
    if (!product)
      throw new apiError("Product not found", StatusCodes.NOT_FOUND);

    await this.productRepository.delete(id);
  };

  addImages = async (productId: string, files: Express.Multer.File[]) => {
    const product = await this.productRepository.findById(productId);
    if (!product)
      throw new apiError("Product not found", StatusCodes.NOT_FOUND);
    // only simple and sizes_only have product level images
    if (!["simple", "sizes_only"].includes(product.productType))
      throw new apiError(
        "Only simple and sizes_only products have product level images",
        StatusCodes.BAD_REQUEST,
      );
    const imageBlobNames = await this.uploadImages(files);
    return await this.productRepository.addImages(productId, imageBlobNames);
  };

  public addSizeToProduct = async (productId: string, data: ICreateSize) => {
    const product = await this.productRepository.findById(productId);
    if (!product)
      throw new apiError("Product not found", StatusCodes.NOT_FOUND);

    if (product.productType !== "sizes_only")
      throw new apiError(
        "Only sizes_only products support this operation",
        StatusCodes.BAD_REQUEST,
      );

    const sizeExists = product.sizes?.some((s) => s.name === data.name);
    if (sizeExists)
      throw new apiError("Size already exists", StatusCodes.BAD_REQUEST);

    return await this.productRepository.addSizeToProduct(productId, data);
  };
  public updateProductSize = async (
    productId: string,
    sizeId: string,
    data: Partial<ICreateSize>,
  ) => {
    const product = await this.productRepository.findById(productId);
    if (!product)
      throw new apiError("Product not found", StatusCodes.NOT_FOUND);

    if (product.productType !== "sizes_only")
      throw new apiError(
        "Only sizes_only products support this operation",
        StatusCodes.BAD_REQUEST,
      );

    const size = product.sizes?.find((s) => s.id === sizeId);
    if (!size) throw new apiError("Size not found", StatusCodes.NOT_FOUND);
    const updateFields: Partial<ICreateSize> = Object.keys(data).reduce(
      (acc, key) => {
        acc[`sizes.$.${key}`] = (data as any)[key];
        return acc;
      },
      {} as any,
    );
    return await this.productRepository.updateProductSize(
      productId,
      sizeId,
      updateFields,
    );
  };
  public deleteProductSize = async (productId: string, sizeId: string) => {
    const product = await this.productRepository.findById(productId);
    if (!product)
      throw new apiError("Product not found", StatusCodes.NOT_FOUND);

    if (product.productType !== "sizes_only")
      throw new apiError(
        "Only sizes_only products support this operation",
        StatusCodes.BAD_REQUEST,
      );

    if (!product.sizes || product.sizes.length === 1)
      throw new apiError(
        "Product must have at least one size",
        StatusCodes.BAD_REQUEST,
      );

    const size = product.sizes?.find((s) => s.id === sizeId);
    if (!size) throw new apiError("Size not found", StatusCodes.NOT_FOUND);

    return await this.productRepository.deleteProductSize(productId, sizeId);
  };

  public addVariant = async (productId: string, data: ICreateVariant) => {
    const product = await this.productRepository.findById(productId);
    if (!product)
      throw new apiError("Product not found", StatusCodes.NOT_FOUND);

    if (!["variant", "variant_with_sizes"].includes(product.productType))
      throw new apiError(
        "Only variant products support this operation",
        StatusCodes.BAD_REQUEST,
      );

    const colorExists = product.variants?.some((v) => v.color === data.color);
    if (colorExists)
      throw new apiError("Color already exists", StatusCodes.BAD_REQUEST);

    this.validateVariant(product.productType, data);

    return await this.productRepository.addVariant(productId, data);
  };

  public updateVariant = async (
    productId: string,
    variantId: string,
    data: Partial<ICreateVariant>,
  ) => {
    const product = await this.productRepository.findById(productId);

    if (!product)
      throw new apiError("Product not found", StatusCodes.NOT_FOUND);
    if (!["variant", "variant_with_sizes"].includes(product.productType))
      throw new apiError(
        "Only variant products support this operation",
        StatusCodes.BAD_REQUEST,
      );

    const variant = product.variants?.find((v) => v.id === variantId);
    if (!variant)
      throw new apiError("Variant not found", StatusCodes.NOT_FOUND);

    if (data.color && data.color !== variant.color) {
      const colorExists = product.variants?.some((v) => v.color === data.color);
      if (colorExists)
        throw new apiError("Color already exists", StatusCodes.BAD_REQUEST);
    }
    const updateFields: Partial<ICreateVariant> = Object.keys(data).reduce(
      (acc, key) => {
        acc[`sizes.$.${key}`] = (data as any)[key];
        return acc;
      },
      {} as any,
    );
    return await this.productRepository.updateVariant(
      productId,
      variantId,
      data,
    );
  };

  public deleteVariant = async (productId: string, variantId: string) => {
    const product = await this.productRepository.findById(productId);
    if (!product)
      throw new apiError("Product not found", StatusCodes.NOT_FOUND);

    if (!product.variants || product.variants.length === 1)
      throw new apiError(
        "Product must have at least one variant",
        StatusCodes.BAD_REQUEST,
      );

    const variant = product.variants?.find((v) => v.id === variantId);
    if (!variant)
      throw new apiError("Variant not found", StatusCodes.NOT_FOUND);

    // delete variant images from azure
    if (variant.images && variant.images.length > 0)
      await Promise.all(
        variant.images.map((img) => this.imageService.deleteByBlobName(img)),
      );

    return await this.productRepository.deleteVariant(productId, variantId);
  };

  public updateVariantImages = async (
    productId: string,
    variantId: string,
    files: Express.Multer.File[],
  ) => {
    const product = await this.productRepository.findById(productId);
    if (!product)
      throw new apiError("Product not found", StatusCodes.NOT_FOUND);

    const variant = product.variants?.id(variantId);
    if (!variant)
      throw new apiError("Variant not found", StatusCodes.NOT_FOUND);

    // delete old images
    await Promise.all(
      variant.images.map((img) => this.imageService.deleteByBlobName(img)),
    );

    const newImages = await this.uploadImages(files);
    return await this.productRepository.updateVariantImages(
      productId,
      variantId,
      newImages,
    );
  };

  // ─── VARIANT SIZES ────────────────────────────────────────────────────────

  public addVariantSize = async (
    productId: string,
    variantId: string,
    data: ICreateSize,
  ) => {
    const product = await this.productRepository.findById(productId);
    if (!product)
      throw new apiError("Product not found", StatusCodes.NOT_FOUND);

    if (product.productType !== "variant_with_sizes")
      throw new apiError(
        "Only variant_with_sizes products support this operation",
        StatusCodes.BAD_REQUEST,
      );

    const variant = product.variants?.id(variantId);
    if (!variant)
      throw new apiError("Variant not found", StatusCodes.NOT_FOUND);

    const sizeExists = variant.sizes?.some((s) => s.size === data.size);
    if (sizeExists)
      throw new apiError(
        "Size already exists in this variant",
        StatusCodes.BAD_REQUEST,
      );

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
    const product = await this.productRepository.findById(productId);
    if (!product)
      throw new apiError("Product not found", StatusCodes.NOT_FOUND);

    const variant = product.variants?.id(variantId);
    if (!variant)
      throw new apiError("Variant not found", StatusCodes.NOT_FOUND);

    const size = variant.sizes?.id(sizeId);
    if (!size) throw new apiError("Size not found", StatusCodes.NOT_FOUND);

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
    const product = await this.productRepository.findById(productId);
    if (!product)
      throw new apiError("Product not found", StatusCodes.NOT_FOUND);

    const variant = product.variants?.id(variantId);
    if (!variant)
      throw new apiError("Variant not found", StatusCodes.NOT_FOUND);

    if (!variant.sizes || variant.sizes.length === 1)
      throw new apiError(
        "Variant must have at least one size",
        StatusCodes.BAD_REQUEST,
      );

    const size = variant.sizes?.id(sizeId);
    if (!size) throw new apiError("Size not found", StatusCodes.NOT_FOUND);

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
    }
  };
}
