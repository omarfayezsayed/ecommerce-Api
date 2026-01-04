import { productDocumnet } from "../../models/product";
import { Types, Query } from "mongoose";
import { Request } from "express";
import {
  updateProductDto,
  createProductDto,
} from "../../dto/productDto/productRequestDto";
export interface ProductRepository {
  findAll(): Promise<Array<productDocumnet>>;
  findOne(id: string): Promise<productDocumnet | null>;
  createOne(data: createProductDto): Promise<productDocumnet>;
  deleteOne(id: string): Promise<any>;
  updateOne(
    id: string,
    data: updateProductDto
  ): Promise<productDocumnet | null>;
}
