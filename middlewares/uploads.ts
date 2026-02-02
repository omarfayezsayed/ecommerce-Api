import multer from "multer";
import { apiError } from "../utils/apiError";
import { StatusCodes } from "http-status-codes";

import { ContainerClient } from "@azure/storage-blob";
import fs from "fs";
import path from "path";
// import {}  from '@types/multer'

const containerSasUrl =
  "https://ecommercev1.blob.core.windows.net/data/images?sp=racwdl&st=2026-01-30T13:52:26Z&se=2026-05-31T21:07:26Z&sv=2024-11-04&sr=c&sig=Mf9wki9IXa9%2FdTXDJQL2eSepeCK09ewbCCnl7WJ%2B3xo%3D";

// ✅ Use ContainerClient directly
const containerClient = new ContainerClient(containerSasUrl);
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 2MB Limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new apiError("file must be an image", StatusCodes.BAD_REQUEST));
    }
  },
});
