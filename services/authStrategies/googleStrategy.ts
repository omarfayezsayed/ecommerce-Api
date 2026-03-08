import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { IAuthUser } from "../interfaces/iAuthUser";
// import { IAuthUser } from '../interfaces/iAuthUser';

export const createGoogleStrategy = (userService: IAuthUser) =>
  new GoogleStrategy(
    {
      // [STEP 1] identify app to Google
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,

      // [STEP 2] Google redirects here after user grants permission
      callbackURL: "http://localhost:5000/api/v1/auth/google/callback",
    },
    // [STEP 3] passport calls this after Google returns the user profile
    async (accessToken, refreshToken, profile, done) => {
      try {
        // [STEP 4] extract user info from Google profile
        const email = profile.emails?.[0].value!;
        const name = profile.displayName;

        // [STEP 5] check if user already exists in DB
        let user = await userService.findByEmail(email);

        if (!user) {
          // [STEP 6] first time — create account automatically
          user = await userService.createGoogleUser({
            email,
            googleId: profile.id,
            name,
            isVerfied: true,
            authProvider: "google",
          });
        }

        // [STEP 7] attach user to req.user
        return done(null, user);
      } catch (err) {
        // [STEP 8] pass error to express error handler
        return done(err as Error);
      }
    },
  );
