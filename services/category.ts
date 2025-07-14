import { Query, Types } from "mongoose";
import { categoryDocumnet, Category, category } from "../models/category";
import { Request, NextFunction } from "express";
import { asyncWrapper } from "../utils/asyncWrapper";
import { apiError } from "../utils/apiError";
import { StatusCodes } from "http-status-codes";
import { Icategory } from "./interfaces/category";
import { apiFeatures } from "../utils/apiFeatures";
import slugify from "slugify";
// import { category } from "../models/category";
export class categoryService implements Icategory {
  constructor() {}
  public createCategory = async (
    categoryData: category
  ): Promise<categoryDocumnet> => {
    try {
      return await Category.create(categoryData);
    } catch (err: any) {
      console.log("error code", err.code);
      // if (err.code === 11000)
      //   throw new apiError("This category name is already exist", 401);
      throw err;
    }
  };
  public findAllCategories = async (
    req: Request,
    query: Query<Array<categoryDocumnet>, categoryDocumnet>
  ): Promise<Array<categoryDocumnet>> => {
    try {
      const features = new apiFeatures(req, query);
      return await features.pagination().fieldlimits().query;
    } catch (err: any) {
      throw err;
    }
  };
  public findCategory = async (
    id: Types.ObjectId
  ): Promise<categoryDocumnet> => {
    try {
      const category = await Category.findById(id);
      if (!category) {
        throw new apiError(
          `no category with that id:${id}`,
          StatusCodes.NOT_FOUND
        );
      }
      return category;
    } catch (err: any) {
      throw err;
    }
  };
  public updateCategory = async (
    id: Types.ObjectId,
    req: Request
  ): Promise<categoryDocumnet> => {
    try {
      const category = await Category.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!category) {
        throw new apiError(
          `no category with that id:${id}`,
          StatusCodes.NOT_FOUND
        );
      }
      return category;
    } catch (err: any) {
      throw err;
    }
  };
  public deleteCategory = async (id: Types.ObjectId): Promise<any> => {
    try {
      const category = await Category.findByIdAndDelete(id);
      if (!category) {
        throw new apiError(
          `no category with that id :${id}`,
          StatusCodes.NOT_FOUND
        );
      }
      return category;
    } catch (err: any) {
      throw err;
    }
  };
}
