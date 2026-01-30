import { CategoryResponseDto } from "../categoryDto/CategoryRespponseDto";

export type SubCategoryResponseDto = {
  id: string;
  name: string;
  slug: string;
  image?: string;
  category?: string | CategoryResponseDto;
};

// This is just when i populate the subcategory when i find a product
