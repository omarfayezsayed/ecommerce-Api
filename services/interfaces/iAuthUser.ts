import { Iuser, userDocumnet } from "../../models/user";

export interface IAuthUser {
  findByEmail(email: string): Promise<userDocumnet | null>;
  findById(id: string): Promise<Partial<Iuser> | null>;
  createLocalUser(data: Partial<Iuser>): Promise<userDocumnet>;
  createGoogleUser(data: Partial<Iuser>): Promise<userDocumnet>;
  updateRefreshToken(
    id: string,
    refreshToken: string | null,
    expiresAt: Date | null,
  ): Promise<void>;

  findbyResetCode(code: string): Promise<userDocumnet | null>;
  findByVerificationCode(code: string): Promise<userDocumnet | null>;
  markAsVerified(userId: string): Promise<void>;
  resetPassword(userId: string, password: string): Promise<void>;
}
