import { StatusCodes } from "http-status-codes";
import { asyncWrapper } from "../utils/asyncWrapper";
import { Request, Response } from "express";
// import { toProductResponseDto } from "../mappers/productMapper";
import { ProductService } from "../services/product";
import { queryParser } from "../utils/queryParser";
import { InteralProductDto } from "../dto/productDto/productInternalDto";
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
      parsedQuery,
    );
    // const resProducts = products.map((product) =>
    //   toProductResponseDto(product),
    // );
    res.status(StatusCodes.OK).json({
      status: "success",
      records: products.length,
      data: products,
    });
  });

  public createProduct = asyncWrapper(async (req: Request, res: Response) => {
    // console.log(req.files, "fillles");
    const productData: InteralProductDto = req.body;
    if (req.files) {
      productData.images = [];
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files.imageCover.length) {
        productData.file = files.imageCover[0];
      }
      if (files.images.length) {
        productData.files = files.images;
      }
    }
    console.log(productData, "dataaa");
    const product = await this.productService.createOne(productData);
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
      req.body,
    );
    res.status(StatusCodes.OK).json({
      status: "success",
      data: product,
    });
  });
}

// {
//           "title": "Mens22 Casual Pr2w3emium Slim Fit T-Shirts",
//           "slug": "mens-casual-premium-slim-fit-t-shirts",
//           "images": [],
//           "imageCover": "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
//           "quantity": 20,
//           "sold": 30,
//           "price": 22.3,
//           "description": "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.",
//           "priceAfterDiscount": 20,
//           "ratingsAverage": 4.4,
//           "ratingsQuantity": 23,
//           "colors": [],
//           "category": "6948132fe62b9cfa3393118c",
//           "brand": "687682d12cea135b9655353d",
//           "subCategory": "6957dec1dd2590770de624e2"
// }
