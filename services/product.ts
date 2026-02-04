import slugify from "slugify";
import { Iproduct, productDocumnet } from "../models/product";
import { ProductRepository } from "../repositories/interfaces/product";
import {
  createProductDto,
  updateProductDto,
} from "../dto/productDto/productRequestDto";
import { apiError } from "../utils/apiError";
import { StatusCodes } from "http-status-codes";
import { BrandQuery } from "./interfaces/brand";
import { CategoryQuery } from "./interfaces/category";
import { subCategoryQuery } from "./interfaces/subcategory";
import mongoose from "mongoose";
import { Icategory } from "../models/category";
import { subCategoryDocument } from "../models/subCategory";
import { InteralProductDto } from "../dto/productDto/productInternalDto";
import { AzureStorageService } from "./azureStorage";
import { StorageFolder } from "../utils/storageFolder";
export class ProductService {
  private repository: ProductRepository;
  private brandQuery: BrandQuery;
  private categoryQuery: CategoryQuery;
  private subCategoryQuery: subCategoryQuery;
  private azureStorageService: AzureStorageService;

  constructor(
    repo: ProductRepository,
    brandQuery: BrandQuery,
    categoryQuery: CategoryQuery,
    subCategoryQuery: subCategoryQuery,
    azureStorageService: AzureStorageService,
  ) {
    this.repository = repo;
    this.brandQuery = brandQuery;
    this.categoryQuery = categoryQuery;
    this.subCategoryQuery = subCategoryQuery;
    this.azureStorageService = azureStorageService;
  }

  public createOne = async (
    data: InteralProductDto,
  ): Promise<productDocumnet> => {
    await this.categoryBrandSubcateoryCheck(data);
    data.slug = slugify(data.title!);
    const uploadPromises: Promise<{ imageUrl: string; blobName: string }>[] =
      [];
    if (data.file) {
      const image = await this.azureStorageService.uploadImage(
        data.file,
        StorageFolder.PRODUCTS,
      );
      data.imageCover = image.blobName;
    }
    if (data.files) {
      data.files.forEach((image) => {
        uploadPromises.push(
          this.azureStorageService.uploadImage(image, StorageFolder.PRODUCTS),
        );
      });
    }
    const images = await Promise.all(uploadPromises);
    images.forEach((image) => {
      data.images?.push(image.blobName);
    });
    const product = await this.repository.createOne(this.mapToIProduct(data));
    return product;
  };

  public getOne = async (id: string) => {
    const product = await this.repository.findOne(id);
    if (!product) {
      throw new apiError(
        `no product with that id:${id}`,
        StatusCodes.NOT_FOUND,
      );
    }
    return product;
  };
  updateOne = async (id: string, data: InteralProductDto) => {
    await this.categoryBrandSubcateoryCheck(data!);
    const productData = this.mapToIProduct(data);
    Object.keys(productData).forEach(
      (key) =>
        (productData as any)[key] === undefined &&
        delete (productData as any)[key],
    );
    const product = await this.repository.updateOne(id, productData);
    if (!product) {
      throw new apiError(
        `no product with that id:${id}`,
        StatusCodes.NOT_FOUND,
      );
    }
    return product;
  };
  public deleteOne = async (id: string) => {
    const product = await this.repository.deleteOne(id);
    if (!product) {
      throw new apiError(
        `no product with that id :${id}`,
        StatusCodes.NOT_FOUND,
      );
    }
    return product;
  };

  public findAll = async (id?: string, queryObj?: object) => {
    const products = await this.repository.findAll(id, queryObj);
    return products;
  };

  private categoryBrandSubcateoryCheck = async (
    data: InteralProductDto,
  ): Promise<void> => {
    const exists = await this.categoryQuery.existsById(data.category!);
    if (!exists) {
      throw new apiError(`category does not exists`, 404);
    }

    if (data.brand) {
      const exists = await this.brandQuery.existsById(data.brand);
      if (!exists) {
        throw new apiError(`brand does not exists`, StatusCodes.NOT_FOUND);
      }
    }

    if (data.subCategory) {
      const subCategory = await this.subCategoryQuery.existsById(
        data.subCategory,
      );
      if (!subCategory) {
        throw new apiError(
          `subCategory does not exists`,
          StatusCodes.NOT_FOUND,
        );
      }
      console.log(subCategory, "subbbbbbbb");
      let categoryId = "";
      if (typeof subCategory.category === "object") {
        const category = subCategory.category as subCategoryDocument;
        categoryId = category.id;
      } else {
        categoryId = subCategory.category;
      }
      if (categoryId !== data.category) {
        throw new apiError(
          `this subcatory does not belong to the input category`,
          StatusCodes.BAD_REQUEST,
        );
      }
    }
  };
  private uploadImage = async (file: Express.Multer.File) => {
    const res = await this.azureStorageService.uploadImage(
      file,
      StorageFolder.CATEGORIES,
    );
    return res;
  };
  private mapToIProduct(data: InteralProductDto): Partial<Iproduct> {
    return {
      title: data.title,
      slug: data.slug,
      quantity: data.quantity,
      sold: data.sold,
      price: data.price,
      description: data.description,
      category: data.category,
      subCategory: data.subCategory,
      brand: data.brand,
      priceAfterDiscount: data.priceAfterDiscount,
      ratingsAverage: data.ratingsAverage,
      ratingsQuantity: data.ratingsQuantity,
      images: data.images,
      imageCover: data.imageCover,
      colors: data.colors,
    };
  }
}
