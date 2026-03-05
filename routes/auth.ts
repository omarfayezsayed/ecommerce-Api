import express from "express";
import { AuthenticationController } from "../controllers/auth";
export const authRouter = express.Router();
const auth = new AuthenticationController();
authRouter.route("/signUp").post(auth.signUp);
