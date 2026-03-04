import slugify from "slugify";
import { categoryDocumnet, Icategory } from "../models/category";
import { CategoryRepository } from "../repositories/interfaces/category";
import {
  createCategoryDto,
  updateCategoryDto,
} from "../dto/categoryDto/categoryRequestDto";
import { apiError } from "../utils/apiError";
import { StatusCodes } from "http-status-codes";
import { CategoryQuery } from "./interfaces/category";
import { CategorInternalDto } from "../dto/categoryDto/categoryInternalDto";
import { AzureStorageService } from "./azureStorage";
import { StorageFolder } from "../utils/storageFolder";
import { ImageProcessingService } from "./imageProcessing";
import { ImageService } from "./imageService";
export class CategoryService implements CategoryQuery {
  private repository: CategoryRepository;
  private imageService: ImageService;
  constructor(repo: CategoryRepository, imageService: ImageService) {
    this.repository = repo;
    this.imageService = imageService;
  }
  public existsById = async (id: string): Promise<boolean> => {
    const exists = await this.repository.findOne(id);
    return !!exists;
  };

  public createOne = async (
    data: CategorInternalDto,
  ): Promise<categoryDocumnet> => {
    if (data.file)
      await this.imageService.uploadFromDto(
        data.file,
        StorageFolder.CATEGORIES,
      );
    data.slug = slugify(data.name!);

    const category = await this.repository.createOne(this.mapToICategory(data));
    return category;
  };

  public getCategory = async (id: string) => {
    const category = await this.repository.findOne(id);
    if (!category) {
      throw new apiError(
        `no category with that id:${id}`,
        StatusCodes.NOT_FOUND,
      );
    }
    return category;
  };
  updateOne = async (id: string, data: CategorInternalDto) => {
    let blobName: string | undefined = "";
    if (data.file) {
      await this.imageService.uploadFromDto(
        data.file,
        StorageFolder.CATEGORIES,
      );
      blobName = data.blobName;
    }
    if (data.name) data.slug = slugify(data.name!);
    const categoryData = this.mapToICategory(data);
    Object.keys(categoryData).forEach(
      (key) =>
        (categoryData as any)[key] === undefined &&
        delete (categoryData as any)[key],
    );

    const category = await this.repository.updateOne(id, categoryData);
    if (!category) {
      if (blobName?.length) await this.imageService.deleteByBlobName(blobName);
      throw new apiError(
        `no category with that id:${id}`,
        StatusCodes.NOT_FOUND,
      );
    }
    return category;
  };
  public deleteOne = async (id: string) => {
    const category = await this.repository.deleteOne(id);
    if (!category) {
      throw new apiError(
        `no category with that id :${id}`,
        StatusCodes.NOT_FOUND,
      );
    }
    return category;
  };

  public findAll = async (queryObj?: any) => {
    const categories = await this.repository.findAll(queryObj);
    return categories;
  };

  private mapToICategory(data: CategorInternalDto): Partial<Icategory> {
    return {
      name: data.name,
      slug: data.slug,
      image: data.image,
      blobName: data.blobName,
    };
  }
}
