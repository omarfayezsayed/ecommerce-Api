import { ContainerClient } from "@azure/storage-blob";
// dotenv.config();

export class AzureStorageService {
  private containerClient: ContainerClient;

  constructor() {
    // Ideally, this URL comes from an Environment Variable
    const containerSasUrl = process.env.AZURE_STORAGE_SAS_URL;

    if (!containerSasUrl) {
      throw new Error("Azure SAS URL is missing in environment variables");
    }

    this.containerClient = new ContainerClient(containerSasUrl);
  }

  async uploadImage(
    file: Express.Multer.File,
  ): Promise<{ imageUrl: string; blobName: string }> {
    try {
      const blobName = `${Date.now()}-${file.originalname}`;
      const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);

      await blockBlobClient.uploadData(file.buffer, {
        blobHTTPHeaders: {
          blobContentType: file.mimetype,
        },
      });

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
