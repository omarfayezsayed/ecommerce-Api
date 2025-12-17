import { plainToClass, plainToInstance } from "class-transformer";
import { NextFunction } from "express";
import { validate } from "class-validator";
import { StatusCodes } from "http-status-codes";
import { apiError } from "../utils/apiError";
import { ClassConstructor } from "class-transformer";
import { Request } from "express";
export function validationHandler<T extends Object>(
  dtoClass: ClassConstructor<T>,
  properity: "params" | "body" | "query" = "body"
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.params.id) req.body.id = req.params.id;
    const categoryRequestData = plainToClass(dtoClass, req[properity], {
      excludeExtraneousValues: true,
    });
    console.log(categoryRequestData);
    console.log(req.params.id);
    const validationErrors = await validate(categoryRequestData, {
      validationError: { target: false, value: true },
    });

    if (!validationErrors.length) {
      return next();
    }
    console.log(categoryRequestData);
    const validationMessages = validationErrors.flatMap((error) => {
      return error.constraints ? Object.values(error.constraints) : [];
    });
    const responseValidationMessage = validationMessages.join(", ");
    return next(
      new apiError(responseValidationMessage, StatusCodes.BAD_REQUEST)
    );
  };
}
