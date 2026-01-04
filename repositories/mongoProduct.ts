import { productDocumnet, Product } from "../models/product";
import { apiError } from "../utils/apiError";
import { StatusCodes } from "http-status-codes";
import { ProductRepository } from "./interfaces/product";

import {
  createProductDto,
  updateProductDto,
} from "../dto/productDto/productRequestDto";
export class MongoProductRepository implements ProductRepository {
  constructor() {}
  public createOne = async (
    data: createProductDto
  ): Promise<productDocumnet> => {
    return await Product.create(data);
  };
  public findAll = async (): Promise<Array<productDocumnet>> => {
    return await Product.find()
      .populate("category")
      .populate("brand")
      .populate({ path: "subCategory", select: "-category" });
  };

  public findOne = async (id: string): Promise<productDocumnet> => {
    const product = await Product.findById(id)
      .populate("category")
      .populate("brand")
      .populate({ path: "subCategory", select: "-category" });
    if (!product) {
      throw new apiError(
        `no product with that id:${id}`,
        StatusCodes.NOT_FOUND
      );
    }
    return product;
  };
  public updateOne = async (
    id: string,
    data: updateProductDto
  ): Promise<productDocumnet> => {
    const product = await Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      throw new apiError(
        `no product with that id:${id}`,
        StatusCodes.NOT_FOUND
      );
    }
    return product;
  };
  public deleteOne = async (id: string): Promise<any> => {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      throw new apiError(
        `no product with that id :${id}`,
        StatusCodes.NOT_FOUND
      );
    }
    return product;
  };
}
