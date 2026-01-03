import { CategoryResponseDto } from "../categoryDto/CategoryRespponseDto";

export type SubCategoryResponseDto = {
  id: string;
  name: string;
  slug: string;
  image?: string;
  category: string | CategoryResponseDto;
};
