import { Request, Response } from "express";
export const handleInvalidRoutes = (req: Request, res: Response) => {
  res.status(400).json({
    msg: `Invalid route (${req.originalUrl}), please try again`,
  });
};
