import { Query, Types } from "mongoose";
import { Request, Response } from "express";
import { category, categoryDocumnet } from "../../models/category";

export interface CategoryRepository {
  createCategory(categoryData: category): Promise<categoryDocumnet>;
  findAllCategories(
    req: Request,
    query: Query<Array<categoryDocumnet>, categoryDocumnet>
  ): Promise<Array<categoryDocumnet>>;
  findCategory(id: Types.ObjectId): Promise<categoryDocumnet>;
  updateCategory(id: Types.ObjectId, req: Request): Promise<categoryDocumnet>;
  deleteCategory(id: Types.ObjectId): Promise<any>;
}
