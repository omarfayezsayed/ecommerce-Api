import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
// import { asyncWrapper } from "../utils/asyncWrapper";
export class AuthenticationController {
  public signUp = async (req: Request, res: Response) => {
    const email = req.body.email as string;
    const password = req.body.password as string;
    console.log(req.body);
    // console.log(password);

    // res.json({ password: hashedPassword, bool });
  };
}
