import { subCategoryDocument } from "../models/subCategory";
import { toCategoryResponseDto } from "./categoryMapper";

import { SubCategoryResponseDto } from "../dto/subCategoryDto/subCategoryResponseDto";
import { categoryDocumnet } from "../models/category";
import mongoose from "mongoose";
export const toSubCategoryResponseDto = (subCategory: subCategoryDocument) => {
  const { name, slug, image, id, category } = subCategory;
  const resSubCategory: SubCategoryResponseDto = {
    name,
    slug,
    image,
    id,
  };
  if (typeof category != "undefined") {
    resSubCategory.category =
      category instanceof mongoose.Types.ObjectId
        ? category.toString()
        : toCategoryResponseDto(category);
  }
  return resSubCategory;
};

export const toSubCategoryProductResponseDto = (
  subCategory: subCategoryDocument
) => {
  const { name, slug, image, id } = subCategory;
  const resSubCategory: SubCategoryResponseDto = {
    name,
    slug,
    image,
    id,
  };
  return resSubCategory;
};
