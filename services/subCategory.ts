import { IsubCategory } from "./interfaces/subCategory";
import {
  subCategoryDocument,
  subCategory,
  Subcategory,
} from "../models/subCategory";
import { Query, Types } from "mongoose";
import { Request, NextFunction } from "express";
import { apiError } from "../utils/apiError";
import { StatusCodes } from "http-status-codes";
import { categoryService } from "./category";
import { apiFeatures } from "../utils/apiFeatures";
const categoryDataLinkLayer = new categoryService();
export class subCategoryService implements IsubCategory {
  constructor() {}
  public createSubCategory = async (
    subCategoryData: subCategory
  ): Promise<subCategoryDocument> => {
    try {
      await categoryDataLinkLayer.findCategory(subCategoryData.category);
      return await Subcategory.create(subCategoryData);
    } catch (err: any) {
      throw err;
    }
  };
  public findAllSubCategories = async (
    req: Request,
    query: Query<Array<subCategoryDocument>, subCategoryDocument>
  ): Promise<Array<subCategoryDocument>> => {
    try {
      const features = new apiFeatures(req, query);
      return await features.pagination().fieldlimits().query;
    } catch (err: any) {
      throw err;
    }
  };

  public findSubCategory = async (
    id: Types.ObjectId
  ): Promise<subCategoryDocument> => {
    try {
      const subCategory = await Subcategory.findById(id);
      if (!subCategory) {
        throw new apiError(
          `no category with that id:${id}`,
          StatusCodes.NOT_FOUND
        );
      }
      return subCategory;
    } catch (err: any) {
      throw err;
    }
  };
  public updateSubCategory = async (
    id: Types.ObjectId,
    req: Request
  ): Promise<subCategoryDocument> => {
    try {
      const subCategory = await Subcategory.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!subCategory) {
        throw new apiError(
          `no category with that id:${id}`,
          StatusCodes.NOT_FOUND
        );
      }
      return subCategory;
    } catch (err: any) {
      throw err;
    }
  };
  public deleteSubCategory = async (id: Types.ObjectId): Promise<any> => {
    try {
      const subCategory = await Subcategory.findByIdAndDelete(id);
      if (!subCategory) {
        throw new apiError(
          `no category with that id :${id}`,
          StatusCodes.NOT_FOUND
        );
      }
      return subCategory;
    } catch (err: any) {
      throw err;
    }
  };
}
