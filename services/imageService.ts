import { StorageFolder } from "../utils/storageFolder";
import { AzureStorageService } from "./azureStorage";
import { ImageProcessingService } from "./imageProcessing";

export class ImageService {
  constructor(
    private readonly imageProcessor: ImageProcessingService,
    private readonly azureStorage: AzureStorageService,
  ) {}

  async uploadFromDto(file: Express.Multer.File, folder: StorageFolder) {
    file.buffer = await this.imageProcessor.compress(file.buffer);
    const image = await this.azureStorage.uploadImage(file, folder);

    return image;
  }

  async deleteByBlobName(blobName: string): Promise<void> {
    return this.azureStorage.deleteImage(blobName);
  }
}
