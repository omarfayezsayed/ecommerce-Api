export class BrandInternalDto {
  name!: string;
  image?: string;
  slug?: string;
  file?: Express.Multer.File;
  blobName?: string;
}
