import slugify from "slugify";
import { brandDocument, Ibrand } from "../models/brand";
import { BrandRepository } from "../repositories/interfaces/brand";

import { apiError } from "../utils/apiError";
import { StatusCodes } from "http-status-codes";
import { BrandQuery } from "./interfaces/brand";
import { BrandInternalDto } from "../dto/brandDto/brandInternalDto";
import { StorageFolder } from "../utils/storageFolder";
import { ImageService } from "./imageService";
export class BrandService implements BrandQuery {
  private repository: BrandRepository;
  private imageService: ImageService;

  constructor(repo: BrandRepository, imageService: ImageService) {
    this.repository = repo;
    this.imageService = imageService;
  }
  public existsById = async (id: string): Promise<boolean> => {
    const exists = await this.repository.findOne(id);
    return !!exists;
  };
  public createOne = async (data: BrandInternalDto): Promise<brandDocument> => {
    data.slug = slugify(data.name);
    if (data.file) {
      const uploadedImage = await this.imageService.uploadFromDto(
        data.file,
        StorageFolder.BRANDS,
      );
      data.blobName = uploadedImage.blobName;
      data.image = uploadedImage.imageUrl;
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
    let blobName: string | undefined = "";
    if (data.file) {
      const uploadedImage = await this.imageService.uploadFromDto(
        data.file,
        StorageFolder.BRANDS,
      );
      data.blobName = uploadedImage.blobName;
      data.image = uploadedImage.imageUrl;
    }

    if (data.name) {
      data.slug = slugify(data.name!);
    }
    const brandData = this.mapToIBrand(data);
    Object.keys(brandData).forEach(
      (key) =>
        (brandData as any)[key] === undefined && delete (brandData as any)[key],
    );

    const brand = await this.repository.updateOne(id, brandData);
    if (!brand) {
      if (blobName?.length) {
        await this.imageService.deleteByBlobName(blobName);
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

  private mapToIBrand(data: BrandInternalDto): Partial<Ibrand> {
    return {
      name: data.name,
      slug: data.slug,
      image: data.image,
      blobName: data.blobName,
    };
  }
}
