import { brandDocument, brand } from "../../models/brand";
import { Types, Query } from "mongoose";
import { Request } from "express";
import {
  createBrandDto,
  updateBrandDto,
} from "../../dto/brandDto/brandRequestDto";
export interface BrandRepository {
  findAll(): Promise<Array<brandDocument>>;
  findOne(id: string): Promise<brandDocument | null>;
  createOne(data: createBrandDto): Promise<brandDocument>;
  deleteOne(id: string): Promise<any>;
  updateOne(id: string, data: updateBrandDto): Promise<brandDocument | null>;
}
