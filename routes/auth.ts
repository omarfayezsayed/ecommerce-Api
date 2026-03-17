import express from "express";
import passport from "../middlewares/passport/PassportRegister";
import { authController } from "../composition/auth";
export const authRouter = express.Router();

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

authRouter.post("/verify-email", authController.verifyEmail);

authRouter.post("/resend-verification", authController.resendVerificationCode);
authRouter.post("/forget-password", authController.forgetPassword);
authRouter.post("/reset-password", authController.resetPassword);
