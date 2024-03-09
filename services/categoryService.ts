import { Query } from "mongoose";
import { categoryDocumnet, Category, category } from "../models/category";
import { Request, NextFunction } from "express";
import { asyncWrapper } from "../utils/asyncWrapper";
import { apiError } from "../utils/apiError";
import { StatusCodes } from "http-status-codes";
import { Icategory } from "./interfaces/category";
// import { category } from "../models/category";
export class categoryService implements Icategory {
  constructor() {}
  public createCategory = async (
    categoryData: category
  ): Promise<categoryDocumnet> => {
    try {
      return await Category.create(categoryData);
    } catch (err: any) {
      throw err;
    }
  };
  public findAllCategories = async (
    req: Request,
    query: Query<Array<categoryDocumnet>, categoryDocumnet>
  ): Promise<Array<categoryDocumnet>> => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 0;
      return await query
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();
    } catch (err: any) {
      throw err;
    }
  };

  public findCategory = async (id: String): Promise<categoryDocumnet> => {
    const category = await Category.findById(id);

    if (!category) {
      throw new apiError(
        `no category with that id:${id}`,
        StatusCodes.NOT_FOUND
      );
    }
    return category;
  };
  public updateCategory = async (
    id: String,
    req: Request
  ): Promise<categoryDocumnet> => {
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
  };
  public deleteCategory = async (id: String): Promise<any> => {
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      throw new apiError(
        `no category with that id :${id}`,
        StatusCodes.NOT_FOUND
      );
    }
    return category;
  };
}
