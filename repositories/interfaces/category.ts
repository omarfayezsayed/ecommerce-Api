import { Query, Types } from "mongoose";
import { Request, Response } from "express";
import { category, categoryDocumnet } from "../../models/category";
import {
  createCategoryDto,
  updateCategoryDto,
} from "../../dto/categoryDto/categoryRequestDto";

export interface categoryRepository {
  createOne(data: createCategoryDto): Promise<categoryDocumnet>;
  findAll(): Promise<Array<categoryDocumnet>>;
  findOne(id: String): Promise<categoryDocumnet | null>;
  updateOne(
    id: String,
    data: updateCategoryDto
  ): Promise<categoryDocumnet | null>;
  deleteOne(id: String): Promise<any>;
}
