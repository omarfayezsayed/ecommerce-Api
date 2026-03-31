import express from "express";
import { userController } from "../composition/user";
import { upload } from "../middlewares/uploads";
import { validationHandler } from "../middlewares/validationHandler";
import { idParamDto } from "../dto/utils/idDto";
import { registerUserDto, updateUserDto } from "../dto/userDto/userRequestDto";
import { authorize } from "../composition/rbac";
import { Permission } from "../rbac/rbacConfig";
import passport from "../middlewares/passport//PassportRegister";

export const userRouter = express.Router();
// signUpUserDto

userRouter.use(
  passport.authenticate("jwt", { session: false, failWithError: true }),
);
userRouter.route("/").get([userController.findAllUsers]);

userRouter
  .route("/")
  .post([
    upload.single("profileImage"),
    validationHandler(registerUserDto),
    userController.createUser,
  ]);
userRouter.get("/me", userController.getMe);
userRouter.patch("/me", userController.updateMe);
userRouter
  .route("/:id")
  .get([validationHandler(idParamDto, "params"), userController.getUser])
  .patch([
    authorize(Permission.UPDATE_USER),
    upload.single("profileImage"),
    validationHandler(idParamDto, "params"),
    validationHandler(updateUserDto, "body"),
    userController.updateUser,
  ])
  .delete([
    authorize(Permission.DELETE_USER),
    validationHandler(idParamDto, "params"),
    userController.deleteUser,
  ]);

userRouter.post(
  "/me/image",
  upload.single("profileImage"),
  userController.uploadProfileImage,
);
userRouter.patch("/me/password", userController.changePassword);

// router.patch('/me', authenticate, userController.updateMe);
// router.delete('/me', authenticate, userController.deleteMe);

// router.delete('/me/avatar', authenticate, userController.deleteAvatar);
