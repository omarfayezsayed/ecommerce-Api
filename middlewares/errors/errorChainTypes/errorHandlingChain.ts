import { NextFunction, Request, Response } from "express";
import { errorSender } from "./errorSender";

export abstract class ErrorHandlingChain {
  private nextHandler!: ErrorHandlingChain;
  public sender: errorSender;

  constructor(sender: errorSender) {
    this.sender = sender;
  }
  setNextHandler(Handler: ErrorHandlingChain): ErrorHandlingChain {
    this.nextHandler = Handler;
    return Handler;
  }

  passNext(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ): Response {
    if (this.nextHandler) {
      return this.nextHandler.process(err, req, res, next);
    } else {
      err.statusCode = 500;
      err.status = "Internal server error";
      return this.sender.send(res, err);
    }
  }

  abstract process(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ): Response;
}
