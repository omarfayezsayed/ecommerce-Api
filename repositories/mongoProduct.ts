import { productDocumnet, Product } from "../models/product";
import { apiError } from "../utils/apiError";
import { StatusCodes } from "http-status-codes";
import { ProductRepository } from "./interfaces/product";
import { queryBuilder } from "../utils/queryBuilder";
import {
  createProductDto,
  updateProductDto,
} from "../dto/productDto/productRequestDto";
export class MongoProductRepository implements ProductRepository {
  constructor() {}

  public createOne = async (
    data: createProductDto,
  ): Promise<productDocumnet> => {
    return await Product.create(data);
  };
  public findAll = async (
    id?: string,
    queryObj?: any,
  ): Promise<Array<productDocumnet>> => {
    let brandId = {};
    if (id) {
      brandId = { brand: id };
    }
    // console.log(brandId, "brand id");
    const query = new queryBuilder(Product.find(brandId), queryObj)
      .sort()
      .fieldlimits()
      .pagination()
      .filter()
      .build();
    return await query;
  };

  public findOne = async (id: string): Promise<productDocumnet | null> => {
    const product = await Product.findById(id)
      .populate("category")
      .populate("brand")
      .populate({ path: "subCategory" });

    return product;
  };
  public updateOne = async (
    id: string,
    data: updateProductDto,
  ): Promise<productDocumnet | null> => {
    const product = await Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    return product;
  };
  public deleteOne = async (id: string): Promise<any> => {
    const product = await Product.findByIdAndDelete(id);

    return product;
  };
}
