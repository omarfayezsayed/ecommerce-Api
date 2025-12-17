import { brandDocument, brand } from "../../models/brand";
import { Types, Query } from "mongoose";
import { Request } from "express";
export interface Ibrand {
  findAllBrands(
    req: Request,
    query: Query<Array<brandDocument>, brandDocument>
  ): Promise<Array<brandDocument>>;
  findBrand(id: Types.ObjectId): Promise<brandDocument>;
  createBrand(brandData: brand): Promise<brandDocument>;
  deleteBrand(id: Types.ObjectId): Promise<any>;
  updateBrand(id: Types.ObjectId, req: Request): Promise<brandDocument>;
}
