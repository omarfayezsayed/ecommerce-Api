import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ProductService } from "../services/product2";
import { asyncWrapper } from "../utils/asyncWrapper";
import { ICreateSize, Product2 } from "../models/product2";

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // ─── BASIC CRUD ───────────────────────────────────────────────────────────

  public getAll = asyncWrapper(async (req: Request, res: Response) => {
    const products = await this.productService.getAll();
    res.json({
      status: "success",
      records: products.length,
      data: products,
    });
  });

  public getById = asyncWrapper(async (req: Request, res: Response) => {
    const product = await this.productService.getById(req.params.id);
    res.json({
      status: "success",
      data: product,
    });
  });

  public create = asyncWrapper(async (req: Request, res: Response) => {
    const product = await this.productService.create(req.body);
    res.status(StatusCodes.CREATED).json({
      status: "success",
      data: product,
    });
  });

  public update = asyncWrapper(async (req: Request, res: Response) => {
    const product = await this.productService.update(req.params.id, req.body);
    res.json({
      status: "success",
      data: product,
    });
  });

  public delete = asyncWrapper(async (req: Request, res: Response) => {
    await this.productService.delete(req.params.id);
    res.status(StatusCodes.NO_CONTENT).send();
  });

  public addImages = asyncWrapper(async (req: Request, res: Response) => {
    const product = await this.productService.addImages(
      req.params.id,
      req.files as Express.Multer.File[],
    );
    res.json({
      status: "success",
      data: product,
    });
  });

  public addSize = asyncWrapper(async (req: Request, res: Response) => {
    console.log("inside add sizes");
    const product = await this.productService.addSizeToProduct(
      req.params.id,
      req.body,
    );
    res.status(StatusCodes.CREATED).json({
      status: "success",
      data: product,
    });
  });
  public updateSize = asyncWrapper(async (req: Request, res: Response) => {
    const { productId, sizeId } = req.params;
    const product = await this.productService.updateProductSize(
      productId,
      sizeId,
      req.body,
    );
    res.json({
      status: "success",
      data: product,
    });
  });

  public deleteSize = asyncWrapper(async (req: Request, res: Response) => {
    const { productId, sizeId } = req.params;
    await this.productService.deleteProductSize(productId, sizeId);
    res.status(StatusCodes.NO_CONTENT).json();
  });
  //  create add variatn and update variant functions here, they will be similar to sizes but with extra checks for product type and unique color
  public addVariant = asyncWrapper(async (req: Request, res: Response) => {
    const product = await this.productService.addVariant(
      req.params.id,
      req.body,
    );
    res.status(StatusCodes.CREATED).json({
      status: "success",
      data: product,
    });
  });

  public updateVariant = asyncWrapper(async (req: Request, res: Response) => {
    const { id, variantId } = req.params;
    const product = await this.productService.updateVariant(
      id,
      variantId,
      req.body,
    );
    res.json({
      status: "success",
      data: product,
    });
  });

  public deleteVariant = asyncWrapper(async (req: Request, res: Response) => {
    const { id, variantId } = req.params;
    await this.productService.deleteVariant(id, variantId);
    res.status(StatusCodes.NO_CONTENT).json();
  });

  // add controller functions for adding updating and deleting variants here, they will be similar to sizes
  public addVariantSize = asyncWrapper(async (req: Request, res: Response) => {
    const { id, variantId } = req.params;
    const product = await this.productService.addVariantSize(
      id,
      variantId,
      req.body,
    );
    res.status(StatusCodes.CREATED).json({
      status: "success",
      data: product,
    });
  });

  public updateVariantSize = asyncWrapper(
    async (req: Request, res: Response) => {
      const { id, variantId, sizeId } = req.params;
      const product = await this.productService.updateVariantSize(
        id,
        variantId,
        sizeId,
        req.body,
      );
      res.json({
        status: "success",
        data: product,
      });
    },
  );

  public deleteVariantSize = asyncWrapper(
    async (req: Request, res: Response) => {
      const { id, variantId, sizeId } = req.params;
      await this.productService.deleteVariantSize(id, variantId, sizeId);
      res.status(StatusCodes.NO_CONTENT).json();
    },
  );

  public addImagesToVariant = asyncWrapper(
    async (req: Request, res: Response) => {
      const { id, variantId } = req.params;
      const product = await this.productService.addImagestoVariant(
        id,
        variantId,
        req.files as Express.Multer.File[],
      );
      res.json({
        status: "success",
        data: product,
      });
    },
  );
}
