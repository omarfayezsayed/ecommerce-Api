export class CategorInternalDto {
  name!: string;
  image?: string;
  slug?: string;
  file?: Express.Multer.File;
  blobName?: string;
}
