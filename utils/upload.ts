// import multer from "multer";
// import { apiError } from "./apiError";
// import { StatusCodes } from "http-status-codes";

// import { ContainerClient } from "@azure/storage-blob";
// import fs from "fs";
// import path from "path";
// // import {}  from '@types/multer'

// const containerSasUrl =
//   "https://ecommercev1.blob.core.windows.net/data/images?sp=racwdl&st=2026-01-30T13:52:26Z&se=2026-05-31T21:07:26Z&sv=2024-11-04&sr=c&sig=Mf9wki9IXa9%2FdTXDJQL2eSepeCK09ewbCCnl7WJ%2B3xo%3D";

// // ✅ Use ContainerClient directly
// const containerClient = new ContainerClient(containerSasUrl);

// export async function uploadImage(file: Express.Multer.File) {
//   try {
//     const blobName = `${Date.now()}-${file.originalname}`;

//     const blockBlobClient = containerClient.getBlockBlobClient(blobName);

//     await blockBlobClient.uploadData(file.buffer, {
//       blobHTTPHeaders: {
//         blobContentType: file.mimetype,
//       },
//     });
//     console.log("Upload successful:", blockBlobClient.url);
//     return { imageUrl: blockBlobClient.url, blobName };
//   } catch (err) {
//     console.log(err, "azure error");
//     throw err;
//   }
// }
