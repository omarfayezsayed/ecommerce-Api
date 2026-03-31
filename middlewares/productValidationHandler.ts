import { plainToInstance, plainToClass } from "class-transformer";
import { NextFunction, Request, Response } from "express";
import { validate } from "class-validator";
import { StatusCodes } from "http-status-codes";
import { apiError } from "../utils/apiError";
import { ClassConstructor } from "class-transformer";
import {
  createDtoByType,
  ProductType,
} from "../dto/product2Dto/productRequestDto";

const collectErrors = (errors: any[]): string[] => {
  const Errors: string[] = errors.flatMap((err) => [
    ...(err.constraints ? Object.values(err.constraints) : []),
    ...collectErrors(err.children || []),
  ]) as string[];
  return Errors;
};
export function productValidationHandler() {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body, "body inside validation");
    if (!req.body.productType) {
      return next(
        new apiError(
          "Validation failed: productType is required",
          StatusCodes.BAD_REQUEST,
        ),
      );
    }
    const RequestData = plainToClass(
      createDtoByType(
        req.body.productType as ProductType,
      ) as ClassConstructor<any>,
      req.body,
      {
        enableImplicitConversion: true,
        exposeDefaultValues: true,
      },
    );

    const validationErrors = await validate(RequestData, {
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: { target: false, value: true },
    });
    console.log(req.body, "body");
    if (!validationErrors.length) {
      req.body = RequestData;
      return next();
    }
    const messages = collectErrors(validationErrors).join(", ");
    return next(
      new apiError("Validation failed: " + messages, StatusCodes.BAD_REQUEST),
    );
  };
}
