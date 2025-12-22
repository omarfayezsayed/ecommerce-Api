import slugify from "slugify";
import { subCategory, subCategoryDocument } from "../models/subCategory";
import { subCategoryRepository } from "../repositories/interfaces/subCategory";
import {
  createSubCategoryDto,
  updateSubCategoryDto,
} from "../dto/subCategoryDto/subCategoryRequestDto";
import { apiError } from "../utils/apiError";
import { StatusCodes } from "http-status-codes";
export class subCategoryService {
  private repository: subCategoryRepository;
  constructor(repo: subCategoryRepository) {
    this.repository = repo;
  }

  public createOne = async (
    data: createSubCategoryDto
  ): Promise<subCategoryDocument> => {
    data.slug = slugify(data.name);
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

  public findAll = async () => {
    const subCategories = await this.repository.findAll();
    return subCategories;
  };
}
