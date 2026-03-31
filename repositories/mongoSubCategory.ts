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
  public findOne = async (
    id: String,
    populate: boolean = true,
  ): Promise<subCategoryDocument | null> => {
    let query = Subcategory.findById(id);
    if (populate) query = query.populate("category");
    return await query;
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
