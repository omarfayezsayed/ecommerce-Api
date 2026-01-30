import { Request, Response, NextFunction, response } from "express";
import { asyncWrapper } from "../utils/asyncWrapper";
import { StatusCodes } from "http-status-codes";
import { SubCategoryService } from "../services/subCategory";

import { toSubCategoryResponseDto } from "../mappers/subCategoryMapper";
import { queryParser } from "../utils/queryParser";
export const addMainCategoryToReqBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.params.id) {
    req.body.category = req.params.id;
  }
  return next();
};

export class SubCategoryController {
  private subCategoryService;
  constructor(subCategoryService: SubCategoryService) {
    this.subCategoryService = subCategoryService;
  }
  public createSubCategory = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const subCategory = await this.subCategoryService.createOne(req.body);
      res.status(StatusCodes.CREATED).json({
        status: "success",
        data: toSubCategoryResponseDto(subCategory),
      });
    }
  );

  public getAllSubCategories = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const parsedQuery = queryParser(req.query);
      const subCategories = await this.subCategoryService.findAll(
        req.params.id,
        parsedQuery
      );
      const resSubCategories = subCategories.map((subCategory) =>
        toSubCategoryResponseDto(subCategory)
      );
      res.status(StatusCodes.OK).json({
        status: "success",
        records: resSubCategories.length,
        data: resSubCategories,
      });
    }
  );

  public getSubCategory = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const subCategory = await this.subCategoryService.findOne(req.params.id);
      res.status(StatusCodes.OK).json({
        status: "success",
        data: toSubCategoryResponseDto(subCategory),
      });
    }
  );

  public updateSubCategory = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const subCategory = await this.subCategoryService.updateOne(
        req.params.id,
        req.body
      );
      res.status(StatusCodes.OK).json({
        status: "success",
        data: toSubCategoryResponseDto(subCategory),
      });
    }
  );

  public deleteSubCategory = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const subCategory = await this.subCategoryService.deleteOne(
        req.params.id
      );
      res.status(StatusCodes.NO_CONTENT).json({
        status: "success",
      });
    }
  );
}
