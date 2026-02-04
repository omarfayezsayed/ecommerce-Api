import slugify from "slugify";
import { IsubCategory, subCategoryDocument } from "../models/subCategory";
import { SubCategoryRepository } from "../repositories/interfaces/subCategory";

import { apiError } from "../utils/apiError";
import { StatusCodes } from "http-status-codes";
import { CategoryQuery } from "./interfaces/category";
import { subCategoryQuery } from "./interfaces/subcategory";
import { SubCategoryInternalDto } from "../dto/subCategoryDto/subCategoryInternalDto";
import { AzureStorageService } from "./azureStorage";
import { StorageFolder } from "../utils/storageFolder";
export class SubCategoryService implements subCategoryQuery {
  private repository: SubCategoryRepository;
  private categoryQuery: CategoryQuery;
  private azureStorageService: AzureStorageService;
  constructor(
    repo: SubCategoryRepository,
    categoryQuery: CategoryQuery,
    azureStorageService: AzureStorageService,
  ) {
    this.repository = repo;
    this.categoryQuery = categoryQuery;
    this.azureStorageService = azureStorageService;
  }
  public existsById = async (
    id: string,
  ): Promise<subCategoryDocument | null> => {
    const subcategory = await this.repository.findOne(id);
    return subcategory;
  };
  public createOne = async (
    data: SubCategoryInternalDto,
  ): Promise<subCategoryDocument> => {
    data.slug = slugify(data.name!);
    const exists = await this.categoryQuery.existsById(data.category!);
    if (!exists) {
      throw new apiError(
        "main category does not exists",
        StatusCodes.NOT_FOUND,
      );
    }
    if (data.file) {
      const image = await this.uploadImage(data.file);
      data.image = image.imageUrl;
      data.blobName = image.blobName;
    }
    const subCategory = await this.repository.createOne(
      this.mapToISubCategory(data),
    );
    return subCategory;
  };

  public findOne = async (id: string) => {
    const subCategory = await this.repository.findOne(id);
    if (!subCategory) {
      throw new apiError(
        `no subCategory with that id:${id}`,
        StatusCodes.NOT_FOUND,
      );
    }
    console.log(subCategory, "whole");
    return subCategory;
  };
  public updateOne = async (id: string, data: SubCategoryInternalDto) => {
    if (data.category) {
      const exists = await this.categoryQuery.existsById(data.category);
      if (!exists) {
        throw new apiError(
          "main category does not exists",
          StatusCodes.NOT_FOUND,
        );
      }
    }
    if (data.file) {
      const image = await this.uploadImage(data.file);
      data.image = image.imageUrl;
      data.blobName = image.blobName;
    }
    if (data.name) data.slug = slugify(data.name);
    const subCategoryData = this.mapToISubCategory(data);
    Object.keys(subCategoryData).forEach(
      (key) =>
        (subCategoryData as any)[key] === undefined &&
        delete (subCategoryData as any)[key],
    );
    const subCategory = await this.repository.updateOne(
      id,
      this.mapToISubCategory(data),
    );
    if (!subCategory) {
      throw new apiError(
        `no subcategory with that id:${id}`,
        StatusCodes.NOT_FOUND,
      );
    }
    return subCategory;
  };
  public deleteOne = async (id: string) => {
    const subCategorycategory = await this.repository.deleteOne(id);
    if (!subCategorycategory) {
      throw new apiError(
        `no subCategorycategory with that id :${id}`,
        StatusCodes.NOT_FOUND,
      );
    }
    return subCategorycategory;
  };

  public findAll = async (id?: string, queryObj?: any) => {
    if (id) {
      const exists = await this.categoryQuery.existsById(id);
      if (!exists) {
        throw new apiError(
          "main category does not exists",
          StatusCodes.NOT_FOUND,
        );
      }
    }
    const subCategories = await this.repository.findAll(id, queryObj);
    return subCategories;
  };
  private mapToISubCategory(
    data: SubCategoryInternalDto,
  ): Partial<IsubCategory> {
    return {
      name: data.name,
      slug: data.slug,
      image: data.image,
      category: data.category,
      blobName: data.blobName,
    };
  }
  private uploadImage = async (file: Express.Multer.File) => {
    const res = await this.azureStorageService.uploadImage(
      file,
      StorageFolder.SUBCATEGORIES,
    );
    return res;
  };
}
