import { SubCategoryRepository } from "./interfaces/subCategory";
import { Subcategory, subCategoryDocument } from "../models/subCategory";
import {
  createSubCategoryDto,
  updateSubCategoryDto,
} from "../dto/subCategoryDto/subCategoryRequestDto";
import mongoose from "mongoose";
export class MongoSubCategoryRepository implements SubCategoryRepository {
  constructor() {}

  public createOne = async (
    data: createSubCategoryDto
  ): Promise<subCategoryDocument> => {
    const subcategory: subCategoryDocument = await Subcategory.create(data);
    console.log(typeof subcategory.category, "herer");
    return subcategory;
  };
  public findAll = async (id?: string): Promise<Array<subCategoryDocument>> => {
    let query = {};
    if (id) {
      query = { category: id };
    }
    const subCategories = await Subcategory.find(query).populate("category");
    return subCategories;
  };
  public findOne = async (id: String): Promise<subCategoryDocument | null> => {
    const subCategory = await Subcategory.findById(id).populate("category");
    return subCategory;
  };
  public updateOne = async (
    id: String,
    data: updateSubCategoryDto
  ): Promise<subCategoryDocument | null> => {
    const subCategory = await Subcategory.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    return subCategory;
  };
  public deleteOne = async (id: String): Promise<any> => {
    const subCategory = await Subcategory.deleteOne();

    return subCategory;
  };
}
