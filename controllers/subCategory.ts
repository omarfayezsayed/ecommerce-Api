import { Request, Response, NextFunction, response } from "express";
import { asyncWrapper } from "../utils/asyncWrapper";
import { StatusCodes } from "http-status-codes";
import { SubCategoryService } from "../services/subCategory";
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
        data: subCategory,
      });
    }
  );

  public getAllSubCategories = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const subCategories = await this.subCategoryService.findAll(
        req.params.id
      );

      res.status(StatusCodes.OK).json({
        status: "success",
        records: subCategories.length,
        data: subCategories,
      });
    }
  );

  public getSubCategory = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const subCategory = await this.subCategoryService.findOne(req.params.id);
      res.status(StatusCodes.OK).json({
        status: "success",
        data: subCategory,
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
        data: subCategory,
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
