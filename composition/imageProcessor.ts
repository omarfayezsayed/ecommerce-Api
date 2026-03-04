import { ImageProcessingService } from "../services/imageProcessing";
import { AzureStorageService } from "../services/azureStorage";
import { ImageService } from "../services/imageService";
const imageProcessor: ImageProcessingService = new ImageProcessingService();
const azureStorageService: AzureStorageService = new AzureStorageService();
export const imageService: ImageService = new ImageService(
  imageProcessor,
  azureStorageService,
);
