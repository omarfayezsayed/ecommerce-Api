import mongoose from "mongoose";
import { brandDocument } from "../../models/brand";
import { categoryDocumnet } from "../../models/category";
import { subCategoryDocument } from "../../models/subCategory";
import { CategoryResponseDto } from "../categoryDto/CategoryRespponseDto";
import { BrandResponseDto } from "../brandDto/brandResponseDto";
import { SubCategoryResponseDto } from "../subCategoryDto/subCategoryResponseDto";

export type productResponseDto = {
  title: string;
  id: string;
  slug: string;
  quantity: number;
  sold: number;
  price: number;
  description: string;
  category?: CategoryResponseDto | string;
  subCategory?: SubCategoryResponseDto | string;
  brand?: BrandResponseDto | string;
  priceAfterDiscount?: number;
  ratingsAverage?: number;
  ratingsQuantity?: number;
  images?: [string];
  imageCover: string;
  colors?: [string];
};
