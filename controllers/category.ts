import { Request, Response, NextFunction } from "express";
import { asyncWrapper } from "../utils/asyncWrapper";
import { StatusCodes } from "http-status-codes";
import { CategoryService } from "../services/category";
import { toCategoryResponseDto } from "../mappers/categoryMapper";
export class CategoryController {
  private categoryService: CategoryService;
  constructor(categoryService: CategoryService) {
    this.categoryService = categoryService;
  }
  public createCategory = asyncWrapper(async (req: Request, res: Response) => {
    const category = await this.categoryService.createOne(req.body);
    res.status(StatusCodes.CREATED).json({
      status: "success",
      data: toCategoryResponseDto(category),
    });
  });

  public getAllCategories = asyncWrapper(
    async (req: Request, res: Response) => {
      const categories = await this.categoryService.findAll();
      const resCatogries = categories.map((cateory) =>
        toCategoryResponseDto(cateory)
      );
      res.status(StatusCodes.OK).json({
        staus: "success",
        records: resCatogries.length,
        data: resCatogries,
      });
    }
  );

  public getCategory = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const category = await this.categoryService.getCategory(req.params.id);
      const { name, image, slug, id } = category;

      res.status(StatusCodes.OK).json({
        staus: "success",
        data: toCategoryResponseDto(category),
      });
    }
  );

  public deleteCategory = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      await this.categoryService.deleteOne(req.params.id);

      res.status(StatusCodes.NO_CONTENT).json({
        status: "success",
      });
    }
  );

  public updateCategory = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const category = await this.categoryService.updateOne(
        req.params.id,
        req.body
      );
      res.status(StatusCodes.OK).json({
        status: "success",
        data: toCategoryResponseDto(category),
      });
    }
  );
}
