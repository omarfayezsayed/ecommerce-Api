import { StatusCodes } from "http-status-codes";
import { asyncWrapper } from "../utils/asyncWrapper";
import { Request, RequestHandler, Response } from "express";
import { BrandService } from "../services/brand";
// import { toBrandResponseDto } from "../mappers/brandMapper";
import { queryParser } from "../utils/queryParser";
import { BrandInternalDto } from "../dto/brandDto/brandInternalDto";
// import { updateOne } from "../utils/controllerFactory";
export class BrandController {
  private brandService: BrandService;
  constructor(brandService: BrandService) {
    this.brandService = brandService;
  }
  public findAllBrands = asyncWrapper(async (req: Request, res: Response) => {
    const parsedQuery = queryParser(req.query);
    const brands = await this.brandService.findAll(parsedQuery);
    // const resBrands = brands.map((brand) => toBrandResponseDto(brand));
    res.status(StatusCodes.OK).json({
      status: "success",
      records: brands.length,
      data: brands,
    });
  });

  public createBrand = asyncWrapper(async (req: Request, res: Response) => {
    const brandData: BrandInternalDto = req.body;
    brandData.file = req.file;
    console.log(brandData);
    const brand = await this.brandService.createOne(brandData);
    console.log(brand);
    res.status(StatusCodes.CREATED).json({
      status: "success",
      data: brand,
    });
  });

  public getBrand = asyncWrapper(async (req: Request, res: Response) => {
    const brand = await this.brandService.getOne(req.params.id);
    res.status(StatusCodes.OK).json({
      staus: "success",
      data: brand,
    });
  });

  public deleteBrand = asyncWrapper(async (req: Request, res: Response) => {
    await this.brandService.deleteOne(req.params.id);

    res.status(StatusCodes.NO_CONTENT).json({
      status: "success",
    });
  });

  public updateBrand = asyncWrapper(async (req: Request, res: Response) => {
    const brandData: BrandInternalDto = req.body;
    brandData.file = req.file;
    const brand = await this.brandService.updateOne(req.params.id, brandData);
    res.status(StatusCodes.OK).json({
      status: "success",
      data: brand,
    });
  });
  // public updateBrand = () => {
  //   return updateOne(this.brandService, toBrandResponseDto);
  // };
}
