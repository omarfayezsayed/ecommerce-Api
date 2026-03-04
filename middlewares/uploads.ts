import multer from "multer";
import { apiError } from "../utils/apiError";
import { StatusCodes } from "http-status-codes";

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
