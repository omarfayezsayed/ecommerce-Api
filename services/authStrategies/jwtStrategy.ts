import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { Request } from "express";
import { IAuthUser } from "../interfaces/iAuthUser";

export const createJwtStrategy = (userService: IAuthUser) =>
  new JwtStrategy(
    {
      // tell passport to extract token from cookie
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET!,
      // pass req to callback so we can access cookies
      passReqToCallback: false,
    },
    // called after passport verifies the token signature
    // payload → decoded token content { id, role }
    async (payload: { id: string; role: string; iat: number }, done) => {
      try {
        // [STEP 1] find user in DB using id from token
        const user = await userService.findById(payload.id);
        console.log("current user", user);
        // [STEP 2] user no longer exists
        if (!user) return done(null, false);
        if (user.passwordChangedAt) {
          const passwordChangedTime = Math.floor(
            user.passwordChangedAt.getTime() / 1000,
          );
          if (passwordChangedTime > payload.iat) {
            return done(null, false);
          }
        }
        // [STEP 3] attach user to req.user
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  );
