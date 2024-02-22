import { Request, Response, NextFunction, response } from "express";
import { Subcategory } from "../models/subCategory";
import { asyncWrapper } from "../utils/asyncWrapper";
import { appError } from "../utils/apiError";
import { Category } from "../models/category";

export const createSubCategory = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const subCategory = await Subcategory.create(req.body);
    res.status(201).json({
      status: "success",
      data: subCategory,
    });
  }
);

export const getAllSubCategories = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    let filter: object = {};
    if (req.params.id) {
      filter = {
        category: req.params.id,
      };
    }
    const subCategories = await Subcategory.find(filter).populate({
      path: "category",
      select: "name -_id",
    });

    res.status(200).json({
      status: "success",
      records: subCategories.length,
      data: subCategories,
    });
  }
);

export const getSubCategory = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const subCategory = await Subcategory.findById(req.params.id);
    if (!subCategory) {
      return next(
        new appError("No subCategory with that id please try antoher id", 404)
      );
    }
    res.status(200).json({
      status: "success",
      data: subCategory,
    });
  }
);

export const updateSubCategory = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const subCategory = await Subcategory.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!subCategory) {
      return next(
        new appError("No subCategory with that id please try antoher id", 404)
      );
    }
    res.status(200).json({
      status: "success",
      data: subCategory,
    });
  }
);

export const deleteSubCategory = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const subCategory = await Subcategory.deleteOne({ _id: req.params.id });
    if (!subCategory.deletedCount) {
      return next(
        new appError(
          "no category with that id please try with another existence id",
          404
        )
      );
    }
    res.status(200).json({
      status: "success",
      data: subCategory,
    });
  }
);
