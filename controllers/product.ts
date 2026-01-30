import { StatusCodes } from "http-status-codes";
import { asyncWrapper } from "../utils/asyncWrapper";
import { Request, Response } from "express";
import { toProductResponseDto } from "../mappers/productMapper";
import { ProductService } from "../services/product";
import { queryParser } from "../utils/queryParser";
export class ProductController {
  private productService: ProductService;
  constructor(productService: ProductService) {
    this.productService = productService;
  }
  public findAllProducts = asyncWrapper(async (req: Request, res: Response) => {
    const parsedQuery = queryParser(req.query);
    console.log(parsedQuery);
    console.log("herere---", req.params.id);
    const products = await this.productService.findAll(
      req.params.id,
      parsedQuery
    );
    const resProducts = products.map((product) =>
      toProductResponseDto(product)
    );
    res.status(StatusCodes.OK).json({
      status: "success",
      records: resProducts.length,
      data: resProducts,
    });
  });

  public createProduct = asyncWrapper(async (req: Request, res: Response) => {
    const product = await this.productService.createOne(req.body);

    res.status(StatusCodes.CREATED).json({
      status: "success",
      data: toProductResponseDto(product),
    });
  });

  public getProduct = asyncWrapper(async (req: Request, res: Response) => {
    const product = await this.productService.getOne(req.params.id);
    res.status(StatusCodes.OK).json({
      staus: "success",
      data: toProductResponseDto(product),
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
      data: toProductResponseDto(product),
    });
  });
}
