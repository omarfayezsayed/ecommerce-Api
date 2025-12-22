import { subCategoryDocument } from "../../models/subCategory";
import {
  createSubCategoryDto,
  updateSubCategoryDto,
} from "../../dto/subCategoryDto/subCategoryRequestDto";

export interface subCategoryRepository {
  createOne(data: createSubCategoryDto): Promise<subCategoryDocument>;
  findAll(): Promise<Array<subCategoryDocument>>;
  findOne(id: String): Promise<subCategoryDocument | null>;
  updateOne(
    id: String,
    data: updateSubCategoryDto
  ): Promise<subCategoryDocument | null>;
  deleteOne(id: String): Promise<any>;
}
