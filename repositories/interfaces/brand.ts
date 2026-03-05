import { brandDocument, Ibrand } from "../../models/brand";

export interface BrandRepository {
  findAll(queryObj?: any): Promise<Array<brandDocument>>;
  findOne(id: string): Promise<brandDocument | null>;
  deleteOne(id: string): Promise<any>;
  createOne(data: Partial<Ibrand>): Promise<brandDocument>;
  updateOne(id: string, data: Partial<Ibrand>): Promise<brandDocument | null>;
}
