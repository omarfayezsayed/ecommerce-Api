import { UserRole } from "./userRoles";

declare global {
  namespace Express {
    interface User {
      //   _id: string;
      id: string;
      email: string;
      role: UserRole;
      isVerified: boolean;
      //   isBanned: boolean;
      passwordChangedAt?: Date;
    }

    // extend Request to use our User type
    interface Request {
      user?: User;
    }
  }
}

export {};
