import { Request, Response, NextFunction, RequestHandler } from "express";

export const asyncWrapper = (
  expressFunction: RequestHandler
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log("inside handler");
    Promise.resolve(expressFunction(req, res, next))
    .catch((err) => {
      return next(err);
    });
  };
  //   expressFunction(req, res, next)
  //     .then((res: any) => {
  //       return res;
  //     })
  //     .catch((err: any) => {
  //       return next(err);
  //     });
  // };
};
