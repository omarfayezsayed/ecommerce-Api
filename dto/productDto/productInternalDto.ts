export class InteralProductDto {
  title?: string;

  slug?: string;

  quantity?: number;

  sold?: number;

  price?: number;

  description?: string;

  category?: string;

  subCategory?: string;

  brand?: string;

  priceAfterDiscount?: number;

  ratingsAverage?: number;

  ratingsQuantity?: number;

  images?: string[];

  colors?: string[];

  imageCover?: string;
  file?: Express.Multer.File;
  files?: Express.Multer.File[];
}
