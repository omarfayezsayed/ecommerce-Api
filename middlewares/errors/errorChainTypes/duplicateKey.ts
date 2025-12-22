import { StatusCodes } from "http-status-codes";
import { ErrorHandlingChain } from "./errorHandlingChain";
import { NextFunction, Request, Response } from "express";

export class duplicateKeyError extends ErrorHandlingChain {
  process(err: any, req: Request, res: Response, next: NextFunction): Response {
    if (err.code === 11000) {
      const duplicateFiled = Object.keys(err.keyValue);
      err.message = `validation Error duplicate value for field: ${duplicateFiled} `;
      err.statusCode = StatusCodes.BAD_REQUEST;
      return this.sender.send(res, err);
    }
    return this.passNext(err, req, res, next);
  }
}
