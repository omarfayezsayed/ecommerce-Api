import { error } from "console";

export class apiError extends Error {
  public statusCode: number;
  public isOperational = true;
  public status: string;
  constructor(msg: string, statusCode: number) {
    super(msg);
    this.statusCode = statusCode;
    this.status = statusCode.toString().startsWith("4") ? "fail" : "error";
    Object.defineProperty(this, "message", {
      enumerable: true,
    });
  }
}
