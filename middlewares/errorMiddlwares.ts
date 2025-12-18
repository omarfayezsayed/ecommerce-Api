import { Request, Response, NextFunction } from "express";
import { apiError } from "../utils/apiError";
import { StatusCodes } from "http-status-codes";

const sendDevelopmentError = (res: Response, err: any): Response => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    statusCode: err.statusCode,
    stack: err.stack,
    err,
  });
};

const sendProductionError = (res: Response, err: any): Response => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.ENV_VARIABLE === "production") {
    sendProductionError(res, err);
  } else {
    sendDevelopmentError(res, err);
  }
};
export const errorHandler2 = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.ENV_VARIABLE === "production") {
    sendProductionError(res, err);
  } else {
    sendDevelopmentError(res, err);
  }
};

export const handleInvalidRoutes = (req: Request, res: Response) => {
  res.status(400).json({
    msg: `Invalid route (${req.originalUrl}), please try again`,
  });
};

export abstract class ErrorHandlingChain {
  private nextHandler!: ErrorHandlingChain;
  public sender: errorSender;
  // constructor(nextHandleer: ErrorHandlingChain) {
  //   this.nextHandler = nextHandleer;
  // }
  constructor(sender: errorSender) {
    this.sender = sender;
  }
  setNextHandler(Handler: ErrorHandlingChain): ErrorHandlingChain {
    this.nextHandler = Handler;
    return Handler;
  }

  passNext(err: any, req: Request, res: Response, next: NextFunction): void {
    console.log("------------------------------------");
    if (this.nextHandler) {
      this.nextHandler.process(err, req, res, next);
    } else {
      err.statusCode = 500;
      err.status = "Internal server rrror";
      this.sender.send(res, err);
    }
  }

  abstract process(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ): void;
}

export class castError extends ErrorHandlingChain {
  process(err: any, req: Request, res: Response, next: NextFunction): void {
    console.log("$$4$$$$----");
    if (err.code === 11000) {
      err.message = "cast Erorr";
      err.statusCode = StatusCodes.BAD_REQUEST;
      console.log("------------------------------------");
      this.sender.send(res, err);
    }
    this.passNext(err, req, res, next);
  }
}
export class HandledError extends ErrorHandlingChain {
  process(err: any, req: Request, res: Response, next: NextFunction): void {
    console.log("------------------------------------");
    if (err instanceof apiError) {
      console.log("------------------------------------");
      this.sender.send(res, err);
    }
    this.passNext(err, req, res, next);
  }
}

export interface errorSender {
  send(res: Response, err: any): Response;
}

export class sendDevelopmentError2 implements errorSender {
  public send(res: Response, err: any): Response {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      statusCode: err.statusCode,
      stack: err.stack,
      err,
    });
  }
}

export class sendProductionError2 implements errorSender {
  public send(res: Response, err: any): Response {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
}
// const sendProductionError = (res: Response, err: any): Response => {
//   return res.status(err.statusCode).json({
// status: err.status,
// message: err.message,
//   });
// };
