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
    const RequestData = plainToClass(dtoClass, req[properity], {
      excludeExtraneousValues: true,
    });
    console.log(RequestData, "object");
    console.log(req.params.id);
    const validationErrors = await validate(RequestData, {
      validationError: { target: false, value: true },
    });

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
      new apiError(responseValidationMessage, StatusCodes.BAD_REQUEST)
    );
  };
}
