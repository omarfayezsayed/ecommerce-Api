// Generic validation middleware using class-validator with whitelist + forbidNonWhitelisted.
// Usage: validateDto(CreateSimpleProductDto) and attach to route.
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { apiError } from "../utils/apiError";
import { StatusCodes } from "http-status-codes";
export function validateDto(dtoClass: new (...args: any[]) => any) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const instance = plainToInstance(dtoClass, req.body, {
      enableImplicitConversion: true,
      exposeDefaultValues: true,
    });
    const errors = await validate(instance, {
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: { target: false },
    });
    if (errors.length) {
      const message = errors
        .map((e) => Object.values(e.constraints || {}).join(", "))
        .filter(Boolean)
        .join("; ");
      return next(
        new apiError(message || "Validation failed", StatusCodes.BAD_REQUEST),
      );
    }
    req.body = instance;
    return next();
  };
}
