import express from "express";
import { userController } from "../composition/user";
import { upload } from "../middlewares/uploads";
import { validationHandler } from "../middlewares/validationHandler";
import { idParamDto } from "../dto/utils/idDto";
import { registerUserDto, updateUserDto } from "../dto/userDto/userRequestDto";

export const userRouter = express.Router();
// signUpUserDto
userRouter.route("/").get([userController.findAllUsers]);

userRouter
  .route("/")
  .post([
    upload.single("profileImage"),
    validationHandler(registerUserDto),
    userController.createUser,
  ]);

userRouter
  .route("/:id")
  .get([validationHandler(idParamDto, "params"), userController.getUser])
  .patch([
    upload.single("profileImage"),
    validationHandler(idParamDto, "params"),
    validationHandler(updateUserDto, "body"),
    userController.updateUser,
  ])
  .delete([validationHandler(idParamDto, "params"), userController.deleteUser]);
