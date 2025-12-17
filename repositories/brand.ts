import { Query, Types } from "mongoose";
import { brandDocument, Brand, brand } from "../models/brand";
import { Request, NextFunction } from "express";
import { asyncWrapper } from "../utils/asyncWrapper";
import { apiError } from "../utils/apiError";
import { StatusCodes } from "http-status-codes";
import { Ibrand } from "./interfaces/brand";
import { apiFeatures } from "../utils/apiFeatures";
import slugify from "slugify";
// import { category } from "../models/category";
export class brandServices implements Ibrand {
  constructor() {}
  public createBrand = async (brandData: brand): Promise<brandDocument> => {
    try {
      return await Brand.create(brandData);
    } catch (err: any) {
      console.log("error code", err.code);
      // if (err.code === 11000)
      //   throw new apiError("This category name is already exist", 401);
      throw err;
    }
  };
  public findAllBrands = async (
    req: Request,
    query: Query<Array<brandDocument>, brandDocument>
  ): Promise<Array<brandDocument>> => {
    try {
      const features = new apiFeatures(req, query);
      return await features.pagination().fieldlimits().query;
    } catch (err: any) {
      throw err;
    }
  };
  public findBrand = async (id: Types.ObjectId): Promise<brandDocument> => {
    try {
      const brand = await Brand.findById(id);
      if (!brand) {
        throw new apiError(
          `no brand with that id:${id}`,
          StatusCodes.NOT_FOUND
        );
      }
      return brand;
    } catch (err: any) {
      throw err;
    }
  };
  public updateBrand = async (
    id: Types.ObjectId,
    req: Request
  ): Promise<brandDocument> => {
    try {
      const brand = await Brand.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!brand) {
        throw new apiError(
          `no brand with that id:${id}`,
          StatusCodes.NOT_FOUND
        );
      }
      return brand;
    } catch (err: any) {
      throw err;
    }
  };
  public deleteBrand = async (id: Types.ObjectId): Promise<any> => {
    try {
      const brand = await Brand.findByIdAndDelete(id);
      if (!brand) {
        throw new apiError(
          `no brand with that id :${id}`,
          StatusCodes.NOT_FOUND
        );
      }
      return brand;
    } catch (err: any) {
      throw err;
    }
  };
}
