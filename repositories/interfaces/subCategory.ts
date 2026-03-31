import { IsubCategory, subCategoryDocument } from "../../models/subCategory";

export interface SubCategoryRepository {
  createOne(data: Partial<IsubCategory>): Promise<subCategoryDocument>;
  findAll(id?: string, queryObj?: any): Promise<Array<subCategoryDocument>>;
  findOne(id: string, populate: boolean): Promise<subCategoryDocument | null>;
  updateOne(
    id: string,
    data: Partial<IsubCategory>,
  ): Promise<subCategoryDocument | null>;
  deleteOne(id: string): Promise<any>;
}
