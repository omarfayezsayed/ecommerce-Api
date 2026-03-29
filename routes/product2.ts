import express from "express";
import { productController } from "../composition/product2";
import multer from "multer";
import { upload } from "../middlewares/uploads";

export const router = express.Router();

router.post("/:id/images", upload.array("images"), productController.addImages);
router.post(
  "/:id/variants/:variantId/images",
  upload.array("images"),
  productController.addImagesToVariant,
);
router.get("/", productController.getAll);
router.get("/:id", productController.getById);
router.post("/", productController.create);
router.patch("/:id", productController.update);
router.delete("/:id", productController.delete);

// sizes
router.post("/:id/sizes", productController.addSize);
router.patch("/:productId/sizes/:sizeId", productController.updateSize);
router.delete("/:productId/sizes/:sizeId", productController.deleteSize);

// variants
router.post("/:id/variants", productController.addVariant);
router.patch("/:id/variants/:variantId", productController.updateVariant);
router.delete("/:id/variants/:variantId", productController.deleteVariant);

// variants_sizes
router.post("/:id/variants/:variantId/sizes", productController.addVariantSize);
router.patch(
  "/:id/variants/:variantId/sizes/:sizeId",
  productController.updateVariantSize,
);
router.delete(
  "/:id/variants/:variantId/sizes/:sizeId",
  productController.deleteVariantSize,
);
