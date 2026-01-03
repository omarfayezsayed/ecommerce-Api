import { subCategoryDocument } from "../models/subCategory";
import { toCategoryResponseDto } from "./categoryMapper";
import mongoose from "mongoose";
import { SubCategoryResponseDto } from "../dto/subCategoryDto/subCategoryResponseDto";
export const toSubCategoryResponseDto = (subCategory: subCategoryDocument) => {
  const { name, slug, image, id, category } = subCategory;
  // console.log(category);
  // console.log(category.toString());
  const resSubCategory: SubCategoryResponseDto = {
    name,
    slug,
    image,
    id,
    category:
      category instanceof mongoose.Types.ObjectId
        ? category.toString()
        : toCategoryResponseDto(category),
  };
  return resSubCategory;
};
