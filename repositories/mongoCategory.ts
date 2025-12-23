import { categoryDocumnet, Category } from "../models/category";
import { CategoryRepository } from "./interfaces/category";

import {
  createCategoryDto,
  updateCategoryDto,
} from "../dto/categoryDto/categoryRequestDto";
export class MongoCategoryRepository implements CategoryRepository {
  constructor() {}

  public createOne = async (
    categoryData: createCategoryDto
  ): Promise<categoryDocumnet> => {
    return await Category.create(categoryData);
  };
  public findAll = async (): Promise<Array<categoryDocumnet>> => {
    const categories = await Category.find();
    return categories;
  };
  public findOne = async (id: String): Promise<categoryDocumnet | null> => {
    const category = await Category.findById(id);
    return category;
  };
  public updateOne = async (
    id: String,
    categoryData: updateCategoryDto
  ): Promise<categoryDocumnet | null> => {
    console.log(categoryData, id, "here");
    const category = await Category.findByIdAndUpdate(id, categoryData, {
      new: true,
      runValidators: true,
    });

    return category;
  };
  public deleteOne = async (id: String): Promise<any> => {
    const category = await Category.findByIdAndDelete(id);
    return category;
  };
}
