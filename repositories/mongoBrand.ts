import { brandDocument, Brand } from "../models/brand";
import { apiError } from "../utils/apiError";
import { StatusCodes } from "http-status-codes";
import { BrandRepository } from "./interfaces/brand";
import {
  createBrandDto,
  updateBrandDto,
} from "../dto/brandDto/brandRequestDto";
export class MongoBrandRepository implements BrandRepository {
  constructor() {}
  public createOne = async (data: createBrandDto): Promise<brandDocument> => {
    return await Brand.create(data);
  };
  public findAll = async (): Promise<Array<brandDocument>> => {
    return await Brand.find();
  };

  public findOne = async (id: string): Promise<brandDocument> => {
    const brand = await Brand.findById(id);
    if (!brand) {
      throw new apiError(`no brand with that id:${id}`, StatusCodes.NOT_FOUND);
    }
    return brand;
  };
  public updateOne = async (
    id: string,
    data: updateBrandDto
  ): Promise<brandDocument> => {
    const brand = await Brand.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!brand) {
      throw new apiError(`no brand with that id:${id}`, StatusCodes.NOT_FOUND);
    }
    return brand;
  };
  public deleteOne = async (id: string): Promise<any> => {
    const brand = await Brand.findByIdAndDelete(id);
    if (!brand) {
      throw new apiError(`no brand with that id :${id}`, StatusCodes.NOT_FOUND);
    }
    return brand;
  };
}
