import { Query } from "mongoose";
import { Request, Response } from "express";
import { category, categoryDocumnet } from "../../models/category";

export interface Icategory {
  createCategory(categoryData: category): Promise<categoryDocumnet>;
  findAllCategories(
    req: Request,
    query: Query<Array<categoryDocumnet>, categoryDocumnet>
  ): Promise<Array<categoryDocumnet>>;
  findCategory(id: String): Promise<categoryDocumnet>;
  updateCategory(id: String, req: Request): Promise<categoryDocumnet>;
  deleteCategory(id: String): Promise<any>;
}
