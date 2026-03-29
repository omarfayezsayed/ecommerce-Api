import { plainToClass } from "class-transformer";
import { NextFunction, Request, Response } from "express";
import { validate } from "class-validator";
import { StatusCodes } from "http-status-codes";
import { apiError } from "../utils/apiError";
import { ClassConstructor } from "class-transformer";

export function validationHandler<T extends Object>(
  dtoClass: ClassConstructor<T>,
  properity: "params" | "body" | "query" = "body",
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log(req, "body inside validation");
    // excludeExtraneousValues: true,
    const RequestData = plainToClass(dtoClass, req[properity], {
      enableImplicitConversion: true,
      exposeDefaultValues: true,
    });
    console.log(RequestData, "object");
    console.log(req.params.id);
    // validationError: { target: false, value: true },
    const validationErrors = await validate(RequestData, {
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: { target: false },
    });
    console.log(req.body, "body");
    if (!validationErrors.length) {
      if (properity === "body") req.body = RequestData;
      return next();
    }
    console.log(RequestData);
    const validationMessages = validationErrors.flatMap((error) => {
      return error.constraints ? Object.values(error.constraints) : [];
    });
    const responseValidationMessage = validationMessages.join(", ");
    return next(
      new apiError(
        "Validation failed: " + responseValidationMessage,
        StatusCodes.BAD_REQUEST,
      ),
    );
  };
}
