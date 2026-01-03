import { StatusCodes } from "http-status-codes";
import { asyncWrapper } from "../utils/asyncWrapper";
import { Request, Response } from "express";
import { BrandService } from "../services/brand";
import { toBrandResponseDto } from "../mappers/brandMapper";
export class BrandController {
  private brandService: BrandService;
  constructor(brandService: BrandService) {
    this.brandService = brandService;
  }
  public findAllBrands = asyncWrapper(async (req: Request, res: Response) => {
    const brands = await this.brandService.findAll();
    const resBrands = brands.map((brand) => toBrandResponseDto(brand));
    res.status(StatusCodes.OK).json({
      status: "success",
      records: resBrands.length,
      data: resBrands,
    });
  });

  public createBrand = asyncWrapper(async (req: Request, res: Response) => {
    const brand = await this.brandService.createOne(req.body);

    res.status(StatusCodes.CREATED).json({
      status: "success",
      data: toBrandResponseDto(brand),
    });
  });

  public getBrand = asyncWrapper(async (req: Request, res: Response) => {
    const brand = await this.brandService.getOne(req.params.id);
    res.status(StatusCodes.OK).json({
      staus: "success",
      data: toBrandResponseDto(brand),
    });
  });

  public deleteBrand = asyncWrapper(async (req: Request, res: Response) => {
    await this.brandService.deleteOne(req.params.id);

    res.status(StatusCodes.NO_CONTENT).json({
      status: "success",
    });
  });

  public updateBrand = asyncWrapper(async (req: Request, res: Response) => {
    const brand = await this.brandService.updateOne(req.params.id, req.body);
    res.status(StatusCodes.OK).json({
      status: "success",
      data: toBrandResponseDto(brand),
    });
  });
}
