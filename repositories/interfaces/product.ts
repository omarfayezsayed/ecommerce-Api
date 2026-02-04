import { Iproduct, productDocumnet } from "../../models/product";

import {
  updateProductDto,
  createProductDto,
} from "../../dto/productDto/productRequestDto";
export interface ProductRepository {
  findAll(id?: string, queryObj?: any): Promise<Array<productDocumnet>>;
  findOne(id: string): Promise<productDocumnet | null>;
  createOne(data: Partial<Iproduct>): Promise<productDocumnet>;
  deleteOne(id: string): Promise<any>;
  updateOne(
    id: string,
    data: Partial<Iproduct>,
  ): Promise<productDocumnet | null>;
}
