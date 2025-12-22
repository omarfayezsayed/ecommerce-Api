import { NextFunction, Request, Response } from "express";
import { ErrorHandlingChain } from "./errorHandlingChain";
import { apiError } from "../../../utils/apiError";

export class HandledError extends ErrorHandlingChain {
  process(err: any, req: Request, res: Response, next: NextFunction): Response {
    if (err instanceof apiError) {
      return this.sender.send(res, err);
    }
    return this.passNext(err, req, res, next);
  }
}
