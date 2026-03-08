import bcrypt from "bcryptjs";
import { apiError } from "../utils/apiError";
import { StatusCodes } from "http-status-codes";
import { jwtGenerator } from "../utils/jwtGenerators";
import { IAuthUser } from "./interfaces/iAuthUser";
import { UserInternalDto } from "../dto/userDto/userInternalDto";

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

  private generateTokens = async (user: any) => {
    const accessToken = jwtGenerator.signAccessToken(user);
    const refreshToken = jwtGenerator.signRefreshToken(user.id);
    return { accessToken, refreshToken };
  };
  private saveRefreshToken = async (userId: string, refreshToken: string) => {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userSerice.updateRefreshToken(
      userId,
      hashedRefreshToken,
      new Date(Date.now() + Number(process.env.REFRESH_TOKEN_EXPIRY)),
    );
  };
  public issueTokens = async (user: any) => {
    const tokens = await this.generateTokens(user);
    await this.saveRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  };
}
