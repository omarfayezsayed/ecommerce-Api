import { Request, Response, NextFunction } from "express";
import { apiError } from "../utils/apiError";

const sendDevelopmentError = (res: Response, err: any): Response => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    statusCode: err.statusCode,
    stack: err.stack,
    err,
  });
};

const sendProductionError = (res: Response, err: any): Response => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.ENV_VARIABLE === "production") {
    sendProductionError(res, err);
  } else {
    sendDevelopmentError(res, err);
  }
};

export const handleInvalidRoutes = (req: Request, res: Response) => {
  res.status(400).json({
    msg: `Invalid route (${req.originalUrl}), please try again`,
  });
};
