import { categoryDocumnet, Icategory } from "../../models/category";

export interface CategoryRepository {
  findAll(queryObj?: any): Promise<Array<categoryDocumnet>>;
  findOne(id: String): Promise<categoryDocumnet | null>;
  updateOne(
    id: String,
    data: Partial<Icategory>,
  ): Promise<categoryDocumnet | null>;
  createOne(data: Partial<Icategory>): Promise<categoryDocumnet>;
  deleteOne(id: String): Promise<any>;
}
