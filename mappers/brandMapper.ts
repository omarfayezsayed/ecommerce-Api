import { BrandResponseDto } from "../dto/brandDto/brandResponseDto";
import { brandDocument } from "../models/brand";

export const toBrandResponseDto = (brand: brandDocument) => {
  const { name, slug, image, id } = brand;
  const resBrand: BrandResponseDto = {
    name,
    slug,
    image,
    id,
  };
  return resBrand;
};
