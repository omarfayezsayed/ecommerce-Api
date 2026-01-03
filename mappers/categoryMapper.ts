import { CategoryResponseDto } from "../dto/categoryDto/CategoryRespponseDto";
import { categoryDocumnet } from "../models/category";

export const toCategoryResponseDto = (category: categoryDocumnet) => {
  const { name, image, slug, id } = category;
  const resCategory: CategoryResponseDto = {
    id,
    name,
    image,
    slug,
  };
  return resCategory;
};
