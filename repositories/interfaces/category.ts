import { Query, Types } from "mongoose";
import { Request, Response } from "express";
import { categoryDocumnet, Icategory } from "../../models/category";
import {
  createCategoryDto,
  updateCategoryDto,
} from "../../dto/categoryDto/categoryRequestDto";

export interface CategoryRepository {
  createOne(data: Icategory): Promise<categoryDocumnet>;
  findAll(queryObj?: any): Promise<Array<categoryDocumnet>>;
  findOne(id: String): Promise<categoryDocumnet | null>;
  updateOne(id: String, data: Icategory): Promise<categoryDocumnet | null>;
  deleteOne(id: String): Promise<any>;
}
