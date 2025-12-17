import { Request, Response, NextFunction, response } from "express";
import { Subcategory, subCategory } from "../models/subCategory";
import { asyncWrapper } from "../utils/asyncWrapper";
import { apiError } from "../utils/apiError";
import { StatusCodes } from "http-status-codes";
import { submongoUserRepository } from "../repositories/subCategory";
import slugify from "slugify";
import { Types } from "mongoose";
const subCategoryDataLinkLayer = new submongoUserRepository();

export const addMainCategoryToReqBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.params.id) {
    console.log("found");
    req.body.category = req.params.id;
    console.log(req.body);
  }
  return next();
};
export class subCategoryController {
  public createSubCategoryHandler = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const subCategoryData: subCategory = {
        name: req.body.name,
        slug: req.body.slug,
        image: req.body.image,
        category: req.body.category,
      };
      if (!req.body.slug) {
        subCategoryData.slug = slugify(req.body.name);
      }
      const subCategory = await subCategoryDataLinkLayer.createSubCategory(
        subCategoryData
      );
      res.status(StatusCodes.CREATED).json({
        status: "success",
        data: subCategory,
      });
    }
  );

  public getAllSubCategoriesHandler = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      let filter: object = {};
      if (req.params.id) {
        filter = {
          category: new Types.ObjectId(req.params.id),
        };
      }
      const subCategories = await subCategoryDataLinkLayer.findAllSubCategories(
        req,
        Subcategory.find(filter)
      );

      res.status(StatusCodes.OK).json({
        status: "success",
        records: subCategories.length,
        data: subCategories,
      });
    }
  );

  public getSubCategoryHandler = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const subCategoryId = new Types.ObjectId(req.params.id);
      const subCategory = await subCategoryDataLinkLayer.findSubCategory(
        subCategoryId
      );
      res.status(StatusCodes.OK).json({
        status: "success",
        data: subCategory,
      });
    }
  );

  public updateSubCategoryHandler = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const subCategoryId = new Types.ObjectId(req.params.id);

      const subCategory = await subCategoryDataLinkLayer.updateSubCategory(
        subCategoryId,
        req
      );
      res.status(StatusCodes.OK).json({
        status: "success",
        data: subCategory,
      });
    }
  );

  public deleteSubCategoryHandler = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const subCategoryId = new Types.ObjectId(req.params.id);
      const subCategory = await subCategoryDataLinkLayer.deleteSubCategory(
        subCategoryId
      );
      res.status(StatusCodes.OK).json({
        status: "success",
        data: subCategory,
      });
    }
  );
}
