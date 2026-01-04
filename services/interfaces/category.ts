import { categoryDocumnet } from "../../models/category";

export interface CategoryQuery {
  existsById(id: string): Promise<boolean>;
}
