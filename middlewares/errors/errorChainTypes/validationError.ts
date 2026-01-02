import { StatusCodes } from "http-status-codes";
import { ErrorHandlingChain } from "./errorHandlingChain";
import { NextFunction, Request, Response } from "express";

export class validationError extends ErrorHandlingChain {
  process(err: any, req: Request, res: Response, next: NextFunction): Response {
    if (err.name === "ValidationError") {
      err.message = err.message;
      err.statusCode = StatusCodes.BAD_REQUEST;
      return this.sender.send(res, err);
    }
    return this.passNext(err, req, res, next);
  }
}
