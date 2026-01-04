import { subCategoryDocument } from "../../models/subCategory";

export interface subCategoryQuery {
  existsById(id: string): Promise<subCategoryDocument | null>;
}
