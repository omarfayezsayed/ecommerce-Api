import { Request, Response, NextFunction } from "express";

export const asyncWrapper = (expressFunction: any): any => {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log("heree");
    expressFunction(req, res, next).catch((err: any) => {
      return next(err);
    });
  };
};
