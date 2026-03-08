import { UserRole } from "../../utils/userRoles";

export class UserInternalDto {
  name?: string;
  slug?: string;
  profileImage?: string;
  email?: string;
  googleId?: string;
  password?: string;
  phone?: string;
  isVerfied?: boolean;
  role?: UserRole;
  file?: Express.Multer.File;
  blobName?: string;
  authProvider?: "local" | "google";
  refreshToken?: string;
  refreshTokenExpiresAt?: Date;
}
