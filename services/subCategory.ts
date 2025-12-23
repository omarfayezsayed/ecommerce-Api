import slugify from "slugify";
import { subCategoryDocument } from "../models/subCategory";
import { SubCategoryRepository } from "../repositories/interfaces/subCategory";
import {
  createSubCategoryDto,
  updateSubCategoryDto,
} from "../dto/subCategoryDto/subCategoryRequestDto";
import { apiError } from "../utils/apiError";
import { StatusCodes } from "http-status-codes";
import { CategoryQuery } from "./interfaces/category";
export class SubCategoryService {
  private repository: SubCategoryRepository;
  private categoryQuery: CategoryQuery;
  constructor(repo: SubCategoryRepository, categoryQuery: CategoryQuery) {
    this.repository = repo;
    this.categoryQuery = categoryQuery;
  }

  public createOne = async (
    data: createSubCategoryDto
  ): Promise<subCategoryDocument> => {
    data.slug = slugify(data.name);
    const exists = await this.categoryQuery.existsById(data.category);
    if (!exists) {
      throw new apiError(
        "main category does not exists",
        StatusCodes.NOT_FOUND
      );
    }
    const subCategory = await this.repository.createOne(data);
    return subCategory;
  };

  public findOne = async (id: string) => {
    const subCategory = await this.repository.findOne(id);
    if (!subCategory) {
      throw new apiError(
        `no subCategory with that id:${id}`,
        StatusCodes.NOT_FOUND
      );
    }
    return subCategory;
  };
  public updateOne = async (id: string, data: updateSubCategoryDto) => {
    const subCategory = await this.repository.updateOne(id, data);
    if (!subCategory) {
      throw new apiError(
        `no subcategory with that id:${id}`,
        StatusCodes.NOT_FOUND
      );
    }
    return subCategory;
  };
  public deleteOne = async (id: string) => {
    const subCategorycategory = await this.repository.deleteOne(id);
    if (!subCategorycategory) {
      throw new apiError(
        `no subCategorycategory with that id :${id}`,
        StatusCodes.NOT_FOUND
      );
    }
    return subCategorycategory;
  };

  public findAll = async (id?: string) => {
    if (id) {
      const exists = await this.categoryQuery.existsById(id);
      if (!exists) {
        throw new apiError(
          "main category does not exists",
          StatusCodes.NOT_FOUND
        );
      }
    }
    const subCategories = await this.repository.findAll(id);
    return subCategories;
  };
}
