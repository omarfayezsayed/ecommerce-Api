import { NextFunction } from "express";
import {
  check,
  Result,
  validationResult,
  ValidationError,
} from "express-validator";
import { apiError } from "../utils/apiError";
import { StatusCodes } from "http-status-codes";

export const validationChecker = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result: Result<ValidationError> = validationResult(req);
  if (!result.isEmpty()) {
    console.log("hhh");
    const wholeErrorMsg = result
      .array()
      .map((el) => {
        return `${el.msg}`;
      })
      .join(", ");
    return next(new apiError(wholeErrorMsg, StatusCodes.BAD_REQUEST));
  }

  return next();
};
