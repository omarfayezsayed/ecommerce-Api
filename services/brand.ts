import slugify from "slugify";
import { brandDocument } from "../models/brand";
import { BrandRepository } from "../repositories/interfaces/brand";
import {
  createBrandDto,
  updateBrandDto,
} from "../dto/brandDto/brandRequestDto";
import { apiError } from "../utils/apiError";
import { StatusCodes } from "http-status-codes";
export class BrandService {
  private repository: BrandRepository;
  constructor(repo: BrandRepository) {
    this.repository = repo;
  }

  public createOne = async (data: createBrandDto): Promise<brandDocument> => {
    data.slug = slugify(data.name);
    const brand = await this.repository.createOne(data);
    return brand;
  };

  public getOne = async (id: string) => {
    const brand = await this.repository.findOne(id);
    if (!brand) {
      throw new apiError(`no brand with that id:${id}`, StatusCodes.NOT_FOUND);
    }
    return brand;
  };
  updateOne = async (id: string, data: updateBrandDto) => {
    const brand = await this.repository.updateOne(id, data);
    if (!brand) {
      throw new apiError(`no brand with that id:${id}`, StatusCodes.NOT_FOUND);
    }
    return brand;
  };
  public deleteOne = async (id: string) => {
    const brand = await this.repository.deleteOne(id);
    if (!brand) {
      throw new apiError(`no brand with that id :${id}`, StatusCodes.NOT_FOUND);
    }
    return brand;
  };

  public findAll = async () => {
    const brands = await this.repository.findAll();
    return brands;
  };
}
