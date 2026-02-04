import { SubCategoryRepository } from "./interfaces/subCategory";
import {
  IsubCategory,
  Subcategory,
  subCategoryDocument,
} from "../models/subCategory";
import {
  createSubCategoryDto,
  updateSubCategoryDto,
} from "../dto/subCategoryDto/subCategoryRequestDto";
import mongoose from "mongoose";
import { queryBuilder } from "../utils/queryBuilder";
export class MongoSubCategoryRepository implements SubCategoryRepository {
  constructor() {}

  public createOne = async (
    data: IsubCategory,
  ): Promise<subCategoryDocument> => {
    const subcategory: subCategoryDocument = await Subcategory.create(data);

    return subcategory;
  };
  public findAll = async (
    id?: string,
    queryObj?: any,
  ): Promise<Array<subCategoryDocument>> => {
    let categorytId = {};
    if (id) {
      categorytId = { category: id };
    }
    const query = new queryBuilder(Subcategory.find(categorytId), queryObj)
      .sort()
      .fieldlimits()
      .pagination()
      .filter()
      .build();
    return await query;
  };
  public findOne = async (id: String): Promise<subCategoryDocument | null> => {
    const subCategory = await Subcategory.findById(id).populate("category");
    return subCategory;
  };
  public updateOne = async (
    id: String,
    data: IsubCategory,
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
