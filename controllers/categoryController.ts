import { Request, Response, NextFunction } from "express";
import { asyncWrapper } from "../utils/asyncWrapper";
import { apiError } from "../utils/apiError";
import { StatusCodes } from "http-status-codes";
import { Category } from "../models/category";
import { categoryService } from "../services/categoryService";
import { category } from "../models/category";
import slugify from "slugify";
const CategoryDataLinklayer = new categoryService();

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
      const category = await CategoryDataLinklayer.findCategory(req.params.id);
      res.status(StatusCodes.OK).json({
        staus: "success",
        data: category,
      });
    }
  );

  public deleteCategoryHandler = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      await CategoryDataLinklayer.deleteCategory(req.params.id);

      res.status(StatusCodes.NO_CONTENT).json({
        status: "success",
      });
    }
  );

  public updateCategoryHandler = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const category = await CategoryDataLinklayer.updateCategory(
        req.params.id,
        req
      );
      res.status(StatusCodes.OK).json({
        status: "success",
        data: category,
      });
    }
  );
}
