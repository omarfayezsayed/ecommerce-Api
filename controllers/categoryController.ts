import { Request, Response, NextFunction } from "express";
import { asyncWrapper } from "../utils/asyncWrapper";
import { StatusCodes } from "http-status-codes";
import { mongoCategoryRepository } from "../repositories/mongoCategory";
import { categoryService } from "../services/category";

export class categoryController {
  private categoryService = new categoryService(new mongoCategoryRepository());
  public createOneHandler = asyncWrapper(
    async (req: Request, res: Response) => {
      const category = await this.categoryService.createOne(req.body);
      res.status(StatusCodes.CREATED).json({
        status: "success",
        data: category,
      });
    }
  );

  public getAllCategoriesHandler = asyncWrapper(
    async (req: Request, res: Response) => {
      const categories = await this.categoryService.findAll();
      res.status(StatusCodes.OK).json({
        staus: "success",
        records: categories.length,
        data: categories,
      });
    }
  );

  public getCategoryHandler = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const category = await this.categoryService.getCategory(req.params.id);
      res.status(StatusCodes.OK).json({
        staus: "success",
        data: category,
      });
    }
  );

  public deleteOneHandler = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      await this.categoryService.deleteOne(req.params.id);

      res.status(StatusCodes.NO_CONTENT).json({
        status: "success",
      });
    }
  );

  public updateOneHandler = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const category = await this.categoryService.updateOne(
        req.params.id,
        req.body
      );
      res.status(StatusCodes.OK).json({
        status: "success",
        data: category,
      });
    }
  );
}
