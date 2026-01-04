import slugify from "slugify";
import { productDocumnet } from "../models/product";
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
export class ProductService {
  private repository: ProductRepository;
  private brandQuery: BrandQuery;
  private categoryQuery: CategoryQuery;
  private subCategoryQuery: subCategoryQuery;
  constructor(
    repo: ProductRepository,
    brandQuery: BrandQuery,
    categoryQuery: CategoryQuery,
    subCategoryQuery: subCategoryQuery
  ) {
    this.repository = repo;
    this.brandQuery = brandQuery;
    this.categoryQuery = categoryQuery;
    this.subCategoryQuery = subCategoryQuery;
  }

  public createOne = async (
    data: createProductDto
  ): Promise<productDocumnet> => {
    await this.categoryBrandSubcateoryCheck(data);
    data.slug = slugify(data.title);
    const product = await this.repository.createOne(data);
    return product;
  };

  public getOne = async (id: string) => {
    const product = await this.repository.findOne(id);
    if (!product) {
      throw new apiError(
        `no product with that id:${id}`,
        StatusCodes.NOT_FOUND
      );
    }
    return product;
  };
  updateOne = async (id: string, data: updateProductDto) => {
    await this.categoryBrandSubcateoryCheck(data);
    const product = await this.repository.updateOne(id, data);
    if (!product) {
      throw new apiError(
        `no product with that id:${id}`,
        StatusCodes.NOT_FOUND
      );
    }
    return product;
  };
  public deleteOne = async (id: string) => {
    const product = await this.repository.deleteOne(id);
    if (!product) {
      throw new apiError(
        `no product with that id :${id}`,
        StatusCodes.NOT_FOUND
      );
    }
    return product;
  };

  public findAll = async () => {
    const products = await this.repository.findAll();
    return products;
  };

  private categoryBrandSubcateoryCheck = async (
    data: createProductDto
  ): Promise<void> => {
    const exists = await this.categoryQuery.existsById(data.category);
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
        data.subCategory
      );
      if (!subCategory) {
        throw new apiError(
          `subCategory does not exists`,
          StatusCodes.NOT_FOUND
        );
      }
      const categoryId: string =
        subCategory.category instanceof mongoose.Types.ObjectId
          ? subCategory.category.toString()
          : subCategory.category.id;
      if (categoryId !== data.category) {
        throw new apiError(
          `this subcatory does not belong to the input category`,
          StatusCodes.BAD_REQUEST
        );
      }
    }
  };
}
