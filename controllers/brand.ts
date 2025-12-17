import { StatusCodes } from "http-status-codes";
import { Brand } from "../models/brand";
import { brandServices } from "../repositories/brand";
import { asyncWrapper } from "../utils/asyncWrapper";
import { Request, Response } from "express";
import { brand } from "../models/brand";
import { Types } from "mongoose";
import slugify from "slugify";
const brandDataLinkLayer = new brandServices();

export class brandController {
  public findAllBrandsHandler = asyncWrapper(
    async (req: Request, res: Response) => {
      const brands = await brandDataLinkLayer.findAllBrands(req, Brand.find());
      res.status(StatusCodes.OK).json({
        status: "success",
        records: brands.length,
        data: brands,
      });
    }
  );

  public createBrandHandler = asyncWrapper(
    async (req: Request, res: Response) => {
      const brandData: brand = {
        name: String(req.body.name),
        image: String(req.body.image),
      };
      brandData.slug = slugify(brandData.name);
      const brand = await brandDataLinkLayer.createBrand(brandData);

      res.status(StatusCodes.CREATED).json({
        status: "success",
        data: brand,
      });
    }
  );

  public getBrandHandler = asyncWrapper(async (req: Request, res: Response) => {
    const brandId: Types.ObjectId = new Types.ObjectId(req.params.id);
    const brand = await brandDataLinkLayer.findBrand(brandId);
    res.status(StatusCodes.OK).json({
      staus: "success",
      data: brand,
    });
  });

  public deleteBrandHandler = asyncWrapper(
    async (req: Request, res: Response) => {
      const brandId: Types.ObjectId = new Types.ObjectId(req.params.id);
      await brandDataLinkLayer.deleteBrand(brandId);

      res.status(StatusCodes.NO_CONTENT).json({
        status: "success",
      });
    }
  );

  public updateBrandHandler = asyncWrapper(
    async (req: Request, res: Response) => {
      console.log(req.params.id);
      const brandId: Types.ObjectId = new Types.ObjectId(req.params.id);
      const category = await brandDataLinkLayer.updateBrand(brandId, req);
      res.status(StatusCodes.OK).json({
        status: "success",
        data: category,
      });
    }
  );
}
