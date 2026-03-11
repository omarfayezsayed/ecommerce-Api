import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { jwtGenerator } from "../utils/jwtGenerators";
import { userService } from "../composition/user";
import { asyncWrapper } from "../utils/asyncWrapper";
import { apiError } from "../utils/apiError";
import { StatusCodes } from "http-status-codes";
import { AuthService } from "../services/auth";
import { UserInternalDto } from "../dto/userDto/userInternalDto";
// import { asyncWrapper } from "../utils/asyncWrapper";
export class AuthController {
  private authService: AuthService;
  constructor(authService: AuthService) {
    this.authService = authService;
  }
  public register = asyncWrapper(async (req: Request, res: Response) => {
    const userData: UserInternalDto = req.body;
    const tokens = await this.authService.register(userData);
    res.json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  });
  public logIn = asyncWrapper(async (req: Request, res: Response) => {
    const email: string = req.body.email;
    const password: string = req.body.password;
    const tokens = await this.authService.logIn(email, password);
    this.setRefreshTokenCookie(res, tokens.refreshToken);
    res.json({
      accessToken: tokens.accessToken,
    });
  });
  public refresh = asyncWrapper(async (req: Request, res: Response) => {
    const refresToken = req.headers?.authorization?.split(" ")[1];
    console.log(refresToken);

    const tokens = await this.authService.refresh(refresToken!);
    res.json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  });
  public logout = asyncWrapper(async (req: Request, res: Response) => {
    const user = req.user as { id: string };
    await this.authService.logOut(user.id);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  });
  public googleCallback = asyncWrapper(async (req: any, res: Response) => {
    const tokens = await this.authService.issueTokens(req.user);

    this.setRefreshTokenCookie(res, tokens.refreshToken);
    res.json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  });
  private setRefreshTokenCookie = (res: Response, refreshToken: string) => {
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
    });
  };
}
