import { Request, Response, NextFunction } from "express";
import { apiError } from "../utils/apiError";
import { StatusCodes } from "http-status-codes";
type featchedResource = (id: string) => Promise<{ user: string }>;
export const isOwner = (fn: featchedResource) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resource = await fn(req.params.id);
      const user: any = req.user;

      if (resource.user.toString() !== user.id)
        return res.status(StatusCodes.FORBIDDEN).json({ message: "Forbidden" });

      next();
    } catch (err: any) {
      next(err);
    }
  };
};
