import { Request, Response, NextFunction } from "express";

export const asyncWrapper = (expressFunction: any): any => {
  return async (req: Request, res: Response, next: NextFunction) => {
    expressFunction(req, res, next)
      .then((res: any) => {
        return res;
      })
      .catch((err: any) => {
        return next(err);
      });
  };
};

export const asyncWrapperTest = (expressFunction: any): any => {
  return async (req: Request, res: Response, next: NextFunction) => {
    expressFunction(req, res, next)
      .then((res: any) => {
        return res;
      })
      .catch((err: any) => {
        return new Error(err);
      });
  };
};
