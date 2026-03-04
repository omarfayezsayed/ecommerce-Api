import { ContainerClient } from "@azure/storage-blob";
import { StorageFolder } from "../utils/storageFolder";
// dotenv.config();

export class AzureStorageService {
  private containerClient: ContainerClient;

  constructor() {
    // Ideally, this URL comes from an Environment Variable
    const containerSasUrl = process.env.AZURE_STORAGE_SAS_URL;

    if (!containerSasUrl) {
      throw new Error("Azure SAS URL is missing in environment variables");
    }
    console.log(containerSasUrl);
    this.containerClient = new ContainerClient(containerSasUrl);
  }

  async uploadImage(
    file: Express.Multer.File,
    folder: StorageFolder,
  ): Promise<{ imageUrl: string; blobName: string }> {
    try {
      const blobName = `${folder}/${Date.now()}-${file.originalname}`;
      const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
      console.log("File size:", file.buffer.length / 1024, "KB");
      console.log("Container URL:", this.containerClient.url);
      console.time("upload");
      await blockBlobClient.uploadData(file.buffer, {
        blobHTTPHeaders: {
          blobContentType: file.mimetype,
        },
      });
      console.timeEnd("upload");
      console.log("Upload successful:", blockBlobClient.url);

      return {
        imageUrl: blockBlobClient.url,
        blobName,
      };
    } catch (err) {
      console.error("Azure Upload Error:", err);
      throw err;
    }
  }

  async deleteImage(blobName: string): Promise<void> {
    try {
      const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
      await blockBlobClient.deleteIfExists();
      console.log(`Blob ${blobName} deleted successfully.`);
    } catch (err) {
      console.error("Azure Delete Error:", err);
      throw err;
    }
  }
}

// Export a single instance to be used across the app
export const azureStorageService = new AzureStorageService();
