import { StatusCodes } from "http-status-codes";
import { ErrorHandlingChain } from "./errorHandlingChain";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { apiError } from "../../../utils/apiError";
export class JwtTokenError extends ErrorHandlingChain {
  process(err: any, req: Request, res: Response, next: NextFunction): Response {
    if (err instanceof jwt.TokenExpiredError) {
      const error = new apiError(
        `Session expired, please login again`,
        StatusCodes.UNAUTHORIZED,
      );
      error.status;
      return this.sender.send(res, error);
    } else if (
      err instanceof jwt.JsonWebTokenError ||
      err.name === "AuthenticationError"
    ) {
      const error = new apiError(`Unauthorizedd`, StatusCodes.UNAUTHORIZED);
      error.status;
      return this.sender.send(res, error);
    }
    return this.passNext(err, req, res, next);
  }
}
