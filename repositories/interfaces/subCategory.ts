import { Query, Types } from "mongoose";
import { Request, Response } from "express";
import { subCategory, subCategoryDocument } from "../../models/subCategory";

export interface IsubCategory {
  createSubCategory(categoryData: subCategory): Promise<subCategoryDocument>;
  findAllSubCategories(
    req: Request,
    query: Query<Array<subCategoryDocument>, subCategoryDocument>
  ): Promise<Array<subCategoryDocument>>;
  findSubCategory(id: Types.ObjectId): Promise<subCategoryDocument>;
  updateSubCategory(
    id: Types.ObjectId,
    req: Request
  ): Promise<subCategoryDocument>;
  deleteSubCategory(id: Types.ObjectId): Promise<any>;
}
