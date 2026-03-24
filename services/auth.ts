import bcrypt from "bcryptjs";
import { apiError } from "../utils/apiError";
import { StatusCodes } from "http-status-codes";
import { jwtGenerator } from "../utils/jwtGenerators";
import { IAuthUser } from "./interfaces/iAuthUser";
import { UserInternalDto } from "../dto/userDto/userInternalDto";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { EmailService } from "./email";
import { RedisService } from "./redis";
export class AuthService {
  private userSerice: IAuthUser;
  private emailService: EmailService;
  private redisService: RedisService;
  constructor(
    userService: IAuthUser,
    emailService: EmailService,
    redisService: RedisService,
  ) {
    this.userSerice = userService;
    this.emailService = emailService;
    this.redisService = redisService;
  }

  public register = async (data: UserInternalDto) => {
    const user = await this.userSerice.findByEmail(data.email!);
    if (user) {
      throw new apiError("Email already in use", StatusCodes.BAD_REQUEST);
    }
    const newUser = await this.userSerice.createLocalUser(data);
    const tokens = await this.issueTokens(newUser);
    const verificationCode = this.generateSixDigitCode();
    await Promise.all([
      this.redisService.saveVerificationCode(newUser.id, verificationCode),
      this.emailService.sendVerificationEmail(newUser.email, verificationCode),
    ]);
    return tokens;
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
  public verifyEmail = async (verificationCode: string) => {
    const userId =
      await this.redisService.getVerificationCode(verificationCode);
    if (!userId) {
      throw new apiError(
        "Invalid code or the verification code has expired ",
        StatusCodes.BAD_REQUEST,
      );
    }

    await Promise.all([
      this.userSerice.markAsVerified(userId),
      this.redisService.deleteVerificationCode(verificationCode),
    ]);
  };
  public resendVerificationCode = async (email: string) => {
    const user = await this.userSerice.findByEmail(email);
    if (!user) {
      throw new apiError("user not found", StatusCodes.NOT_FOUND);
    }
    if (user.isVerified) {
      throw new apiError("Email already verified", StatusCodes.BAD_REQUEST);
    }
    const code = this.generateSixDigitCode();

    await Promise.all([
      await this.redisService.saveVerificationCode(user.id, code),
      await this.emailService.sendVerificationEmail(email, code),
    ]);
  };
  public forgetPassword = async (email: string) => {
    const user = await this.userSerice.findByEmail(email);
    if (!user) {
      return { message: "If this email exists you will receive a reset code" };
    }

    const code = this.generateSixDigitCode();
    await Promise.all([
      this.redisService.saveResetCode(user.id, code),
      this.emailService.sendResetPasswordEmail(email, code),
    ]);

    return { message: "If this email exists you will receive a reset code" };
  };
  public resetPassword = async (data: {
    code: string;
    newPassword: string;
  }) => {
    const userId = await this.redisService.getResetCode(data.code);
    if (!userId) {
      throw new apiError(
        "Invalid code or Code expired, please request a new one",
        StatusCodes.BAD_REQUEST,
      );
    }

    await this.userSerice.resetPassword(userId, data.newPassword);
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

  private generateSixDigitCode = () => {
    return Math.floor(100000 + crypto.randomInt(900000)).toString();
  };
}
