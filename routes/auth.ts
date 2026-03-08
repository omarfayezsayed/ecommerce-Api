import express from "express";
import passport from "passport";
import { authController } from "../composition/auth";
import { createGoogleStrategy } from "../services/authStrategies/googleStrategy";
import { userService } from "../composition/auth";
export const authRouter = express.Router();

passport.use(createGoogleStrategy(userService));

authRouter.route("/register").post(authController.register);
authRouter.route("/logIn").post(authController.logIn);
authRouter.route("/google").get(
  passport.authenticate("google", {
    scope: ["email", "profile"],
    session: false,
  }),
);

authRouter
  .route("/google/callback")
  .get(
    passport.authenticate("google", { session: false }),
    authController.googleCallback,
  );
