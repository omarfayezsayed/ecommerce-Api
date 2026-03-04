import sharp from "sharp";

export class ImageProcessingService {
  async compress(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer)
      .resize(1024, 1024, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();
  }
}
