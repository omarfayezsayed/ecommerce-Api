import express from "express";
import passport from "passport";
import { authController } from "../composition/auth";
import { createGoogleStrategy } from "../services/authStrategies/googleStrategy";
import { createJwtStrategy } from "../services/authStrategies/jwtStrategy";
import { userService } from "../composition/auth";
export const authRouter = express.Router();

passport.use("jwt", createJwtStrategy(userService));
passport.use(createGoogleStrategy(userService));

authRouter.route("/register").post(authController.register);
authRouter.route("/logIn").post(authController.logIn);
authRouter.route("/refresh").post(authController.refresh);
authRouter.route("/google").get(
  passport.authenticate("google", {
    scope: ["email", "profile"],
    session: false,
  }),
);
authRouter
  .route("/logOut")
  .post(
    passport.authenticate("jwt", { session: false, failWithError: true }),
    authController.logout,
  );

authRouter
  .route("/google/callback")
  .get(
    passport.authenticate("google", { session: false }),
    authController.googleCallback,
  );
