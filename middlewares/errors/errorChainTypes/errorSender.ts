import { Response } from "express";
export interface errorSender {
  send(res: Response, err: any): Response;
}

export class sendDevelopmentError implements errorSender {
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

export class sendProductionError implements errorSender {
  public send(res: Response, err: any): Response {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
}
