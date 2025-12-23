import { SubCategoryRepository } from "./interfaces/subCategory";
import { Subcategory, subCategoryDocument } from "../models/subCategory";
import {
  createSubCategoryDto,
  updateSubCategoryDto,
} from "../dto/subCategoryDto/subCategoryRequestDto";
export class MongoSubCategoryRepository implements SubCategoryRepository {
  constructor() {}

  public createOne = async (
    data: createSubCategoryDto
  ): Promise<subCategoryDocument> => {
    return await Subcategory.create(data);
  };
  public findAll = async (id?: string): Promise<Array<subCategoryDocument>> => {
    let query = {};
    if (id) {
      query = { category: id };
    }
    const categories = await Subcategory.find(query);
    return categories;
  };
  public findOne = async (id: String): Promise<subCategoryDocument | null> => {
    const category = await Subcategory.findById(id);
    return category;
  };
  public updateOne = async (
    id: String,
    data: updateSubCategoryDto
  ): Promise<subCategoryDocument | null> => {
    const category = await Subcategory.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    return category;
  };
  public deleteOne = async (id: String): Promise<any> => {
    const category = await Subcategory.findByIdAndDelete(id);

    return category;
  };
}
