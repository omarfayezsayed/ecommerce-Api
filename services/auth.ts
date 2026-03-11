import bcrypt from "bcryptjs";
import { apiError } from "../utils/apiError";
import { StatusCodes } from "http-status-codes";
import { jwtGenerator } from "../utils/jwtGenerators";
import { IAuthUser } from "./interfaces/iAuthUser";
import { UserInternalDto } from "../dto/userDto/userInternalDto";
import jwt from "jsonwebtoken";
import crypto from "crypto";
export class AuthService {
  private userSerice: IAuthUser;
  constructor(userService: IAuthUser) {
    this.userSerice = userService;
  }
  public register = async (data: UserInternalDto) => {
    const user = await this.userSerice.findByEmail(data.email!);
    if (user) {
      throw new apiError("Email already in use", StatusCodes.BAD_REQUEST);
    }
    const newUser = await this.userSerice.createLocalUser(data);
    return await this.issueTokens(newUser);
  };
  public logIn = async (email: string, password: string) => {
    const user = await this.userSerice.findByEmail(email);
    if (!user) {
      throw new apiError("Invalid credintials", StatusCodes.BAD_REQUEST);
    }
    const valid = await bcrypt.compare(password, user.password!);
    if (!valid) {
      throw new apiError("Invalid credintials", StatusCodes.BAD_REQUEST);
    }
    return await this.issueTokens(user);
  };
  public logOut = async (id: string) => {
    await this.saveRefreshToken(id, null);
  };
  public refresh = async (refreshToken: string) => {
    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!,
    ) as { id: string; iat: number; exp: number };
    const user = await this.userSerice.findById(payload.id);
    if (!user?.refreshToken) {
      throw new apiError("Invalid Token", StatusCodes.UNAUTHORIZED);
    }
    const refreshToken64Length = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const isValid = await bcrypt.compare(
      refreshToken64Length,
      user?.refreshToken!,
    );
    if (!isValid) throw new apiError("Invalid Token", StatusCodes.UNAUTHORIZED);
    return await this.issueTokens(user);
  };
  public issueTokens = async (user: any) => {
    const tokens = await this.generateTokens(user);
    await this.saveRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  };
  private generateTokens = async (user: any) => {
    const accessToken = jwtGenerator.signAccessToken(user);
    const refreshToken = jwtGenerator.signRefreshToken(user);
    return { accessToken, refreshToken };
  };
  private saveRefreshToken = async (
    userId: string,
    refreshToken: string | null,
  ) => {
    if (refreshToken == null) {
      await this.userSerice.updateRefreshToken(userId, null, null);
      return;
    }
    const refreshToken64Length = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    const hashedRefreshToken = await bcrypt.hash(refreshToken64Length, 10);
    await this.userSerice.updateRefreshToken(
      userId,
      hashedRefreshToken,
      new Date(Date.now() + Number(process.env.REFRESH_TOKEN_EXPIRY)),
    );
  };
}
