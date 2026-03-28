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
}
