import slugify from "slugify";
import { categoryDocumnet } from "../models/category";
import { CategoryRepository } from "../repositories/interfaces/category";
import {
  createCategoryDto,
  updateCategoryDto,
} from "../dto/categoryDto/categoryRequestDto";
import { apiError } from "../utils/apiError";
import { StatusCodes } from "http-status-codes";
import { CategoryQuery } from "./interfaces/category";
export class CategoryService implements CategoryQuery {
  private repository: CategoryRepository;
  constructor(repo: CategoryRepository) {
    this.repository = repo;
  }
  public existsById = async (id: string): Promise<boolean> => {
    const exists = await this.repository.findOne(id);
    return !!exists;
  };

  public createOne = async (
    data: createCategoryDto
  ): Promise<categoryDocumnet> => {
    data.slug = slugify(data.name);
    const category = await this.repository.createOne(data);
    return category;
  };

  public getCategory = async (id: string) => {
    const category = await this.repository.findOne(id);
    if (!category) {
      throw new apiError(
        `no category with that id:${id}`,
        StatusCodes.NOT_FOUND
      );
    }
    return category;
  };
  updateOne = async (id: string, data: updateCategoryDto) => {
    const category = await this.repository.updateOne(id, data);
    if (!category) {
      throw new apiError(
        `no category with that id:${id}`,
        StatusCodes.NOT_FOUND
      );
    }
    return category;
  };
  public deleteOne = async (id: string) => {
    const category = await this.repository.deleteOne(id);
    if (!category) {
      throw new apiError(
        `no category with that id :${id}`,
        StatusCodes.NOT_FOUND
      );
    }
    return category;
  };

  public findAll = async () => {
    const categories = await this.repository.findAll();
    return categories;
  };
}
