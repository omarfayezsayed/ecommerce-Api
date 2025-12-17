import { Request, Response, NextFunction } from "express";
import { asyncWrapper } from "../utils/asyncWrapper";
import { apiError } from "../utils/apiError";
import { StatusCodes } from "http-status-codes";
import { Category } from "../models/category";
import { mongoUserRepository } from "../repositories/category";
import { category } from "../models/category";
import slugify from "slugify";
import { Types } from "mongoose";
const CategoryDataLinklayer = new mongoUserRepository();

export class categoryController {
  public createCategoryHandler = asyncWrapper(
    async (req: Request, res: Response) => {
      const categoryData: category = {
        name: req.body.name,
        image: req.body.image,
      };
      categoryData.slug = slugify(req.body.name);
      const category = await CategoryDataLinklayer.createCategory(categoryData);
      res.status(StatusCodes.CREATED).json({
        status: "success",
        data: category,
      });
    }
  );

  public getAllCategoriesHandler = asyncWrapper(
    async (req: Request, res: Response) => {
      const categories = await CategoryDataLinklayer.findAllCategories(
        req,
        Category.find()
      );
      res.status(StatusCodes.OK).json({
        staus: "success",
        records: categories.length,
        data: categories,
      });
    }
  );

  public getCategoryHandler = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const categoryId: Types.ObjectId = new Types.ObjectId(req.params.id);

      const category = await CategoryDataLinklayer.findCategory(categoryId);
      res.status(StatusCodes.OK).json({
        staus: "success",
        data: category,
      });
    }
  );

  public deleteCategoryHandler = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const categoryId: Types.ObjectId = new Types.ObjectId(req.params.id);
      await CategoryDataLinklayer.deleteCategory(categoryId);

      res.status(StatusCodes.NO_CONTENT).json({
        status: "success",
      });
    }
  );

  public updateCategoryHandler = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      console.log(req.params.id);
      const categoryId: Types.ObjectId = new Types.ObjectId(req.params.id);
      const category = await CategoryDataLinklayer.updateCategory(
        categoryId,
        req
      );
      res.status(StatusCodes.OK).json({
        status: "success",
        data: category,
      });
    }
  );
}
