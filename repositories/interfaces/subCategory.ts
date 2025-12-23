import { subCategoryDocument } from "../../models/subCategory";
import {
  createSubCategoryDto,
  updateSubCategoryDto,
} from "../../dto/subCategoryDto/subCategoryRequestDto";

export interface SubCategoryRepository {
  createOne(data: createSubCategoryDto): Promise<subCategoryDocument>;
  findAll(id?: string): Promise<Array<subCategoryDocument>>;
  findOne(id: string): Promise<subCategoryDocument | null>;
  updateOne(
    id: string,
    data: updateSubCategoryDto
  ): Promise<subCategoryDocument | null>;
  deleteOne(id: string): Promise<any>;
}
