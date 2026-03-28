import express from "express";
import { productController } from "../composition/product2";
import multer from "multer";
import { upload } from "../middlewares/uploads";

export const router = express.Router();

router.post("/:id/images", upload.array("images"), productController.addImages);
router.get("/", productController.getAll);
router.get("/:id", productController.getById);
router.post("/", productController.create);
router.put("/:id", productController.update);
router.delete("/:id", productController.delete);
router.post("/:id/sizes", productController.addSize);
router.patch("/:productId/sizes/:sizeId", productController.updateSize);
router.delete("/:productId/sizes/:sizeId", productController.deleteSize);
