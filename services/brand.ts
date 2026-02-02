import slugify from "slugify";
import { brandDocument, Ibrand } from "../models/brand";
import { BrandRepository } from "../repositories/interfaces/brand";

import { apiError } from "../utils/apiError";
import { StatusCodes } from "http-status-codes";
import { BrandQuery } from "./interfaces/brand";
import { BrandInternalDto } from "../dto/brandDto/brandInternalDto";
import { AzureStorageService } from "./azureStorage";
export class BrandService implements BrandQuery {
  private repository: BrandRepository;
  private azureStorageService: AzureStorageService;
  constructor(repo: BrandRepository, azureStorageService: AzureStorageService) {
    this.repository = repo;
    this.azureStorageService = azureStorageService;
  }
  public existsById = async (id: string): Promise<boolean> => {
    const exists = await this.repository.findOne(id);
    return !!exists;
  };
  public createOne = async (data: BrandInternalDto): Promise<brandDocument> => {
    data.slug = slugify(data.name);
    console.log(BrandInternalDto, "internal");
    if (typeof data.file != "undefined") {
      const image = await this.uploadImage(data.file);
      data.blobName = image.blobName;
      data.image = image.imageUrl;
    }

    const brand = await this.repository.createOne(this.mapToIBrand(data));
    return brand;
  };

  public getOne = async (id: string) => {
    const brand = await this.repository.findOne(id);
    if (!brand) {
      throw new apiError(`no brand with that id:${id}`, StatusCodes.NOT_FOUND);
    }
    return brand;
  };
  updateOne = async (id: string, data: BrandInternalDto) => {
    let blobName: string = "";
    if (typeof data.file != "undefined") {
      const image = await this.uploadImage(data.file);
      data.blobName = image.blobName;
      data.image = image.imageUrl;
      blobName = image.blobName;
    }
    const brandData = this.mapToIBrand(data);
    Object.keys(brandData).forEach(
      (key) =>
        (brandData as any)[key] === undefined && delete (brandData as any)[key],
    );
    console.log("##########");
    const brand = await this.repository.updateOne(id, brandData);
    if (!brand) {
      if (blobName.length) {
        await this.azureStorageService.deleteImage(blobName);
      }
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

  public findAll = async (queryObj?: any) => {
    const brands = await this.repository.findAll(queryObj);
    return brands;
  };
  private uploadImage = async (file: Express.Multer.File) => {
    const res = await this.azureStorageService.uploadImage(file);
    return res;
  };
  private mapToIBrand(data: BrandInternalDto): Ibrand {
    return {
      name: data.name,
      slug: data.slug,
      image: data.image,
      blobName: data.blobName,
    };
  }
}
