import { Request, Response, NextFunction, response } from "express";
import { Category } from "../models/category";
import { asyncWrapper } from "../utils/asyncWrapper";
import { appError } from "../utils/error";
import { NullExpression } from "mongoose";
export const createCategory = asyncWrapper(
  async (req: Request, res: Response) => {
    console.log(req.body);
    const category = await Category.create(req.body);
    res.status(201).json({
      status: "success",
      data: category,
    });
  }
);

export const getAllCategories = asyncWrapper(
  async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 0;
    const skip = (page - 1) * limit || 0;
    const categories = await Category.find().skip(skip).limit(limit);

    res.status(201).json({
      staus: "success",
      records: categories.length,
      data: categories,
    });
  }
);

export const getCategory = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return next(
        new appError(
          "no category with that id please try with another existence id",
          404
        )
      );
    }
    res.status(201).json({
      staus: "success",
      data: category,
    });
  }
);

export const deleteCategory = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await Category.deleteOne({ _id: req.params.id });
    if (!category.deletedCount) {
      return next(
        new appError(
          "no category with that id please try with another existence id",
          404
        )
      );
    }
    res.status(200).json({
      status: "success",
      data: category,
    });
  }
);

export const updateCategory = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await Category.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        runValidators: true,
        new: true,
      }
    );
    if (!category) {
      return next(
        new appError(
          "no category with that id please try with another existence id",
          404
        )
      );
    }
    res.status(200).json({
      status: "success",
      data: category,
    });
  }
);
