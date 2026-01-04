import { StatusCodes } from "http-status-codes";
import { asyncWrapper } from "../utils/asyncWrapper";
import { Request, Response } from "express";
import { BrandService } from "../services/brand";
import { toBrandResponseDto } from "../mappers/brandMapper";
import { ProductService } from "../services/product";
export class ProductController {
  private productService: ProductService;
  constructor(productService: ProductService) {
    this.productService = productService;
  }
  public findAllProducts = asyncWrapper(async (req: Request, res: Response) => {
    const products = await this.productService.findAll();

    res.status(StatusCodes.OK).json({
      status: "success",
      records: products.length,
      data: products,
    });
  });

  public createProduct = asyncWrapper(async (req: Request, res: Response) => {
    const product = await this.productService.createOne(req.body);

    res.status(StatusCodes.CREATED).json({
      status: "success",
      data: product,
    });
  });

  public getProduct = asyncWrapper(async (req: Request, res: Response) => {
    const product = await this.productService.getOne(req.params.id);
    res.status(StatusCodes.OK).json({
      staus: "success",
      data: product,
    });
  });

  public deleteProduct = asyncWrapper(async (req: Request, res: Response) => {
    await this.productService.deleteOne(req.params.id);

    res.status(StatusCodes.NO_CONTENT).json({
      status: "success",
    });
  });

  public updateProduct = asyncWrapper(async (req: Request, res: Response) => {
    const product = await this.productService.updateOne(
      req.params.id,
      req.body
    );
    res.status(StatusCodes.OK).json({
      status: "success",
      data: product,
    });
  });
}
