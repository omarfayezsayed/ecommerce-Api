import { brandDocument, Brand } from "../models/brand";
import { apiError } from "../utils/apiError";
import { StatusCodes } from "http-status-codes";
import { BrandRepository } from "./interfaces/brand";
import {
  createBrandDto,
  updateBrandDto,
} from "../dto/brandDto/brandRequestDto";
import { queryBuilder } from "../utils/queryBuilder";
export class MongoBrandRepository implements BrandRepository {
  constructor() {}
  public createOne = async (data: createBrandDto): Promise<brandDocument> => {
    return await Brand.create(data);
  };
  public findAll = async (queryObj?: any): Promise<Array<brandDocument>> => {
    const query = new queryBuilder(Brand.find(), queryObj)
      .sort()
      .fieldlimits()
      .pagination()
      .filter()
      .build();
    return await query;
  };

  public findOne = async (id: string): Promise<brandDocument | null> => {
    const brand = await Brand.findById(id);

    return brand;
  };
  public updateOne = async (
    id: string,
    data: updateBrandDto,
  ): Promise<brandDocument | null> => {
    const brand = await Brand.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    return brand;
  };
  public deleteOne = async (id: string): Promise<any> => {
    const brand = await Brand.findByIdAndDelete(id);

    return brand;
  };
}
