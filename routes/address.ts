// routes/address.router.ts
import express from "express";
import passport from "../middlewares/passport/PassportRegister";
import { addressController } from "../composition/address";
import { validationHandler } from "../middlewares/validationHandler";
import {
  CreateAddressDto,
  UpdateAddressDto,
} from "../dto/addressDto/addressRequestDto";
import { idParamDto } from "../dto/utils/idDto";
import { authorize } from "../composition/rbac";
import { Permission } from "../rbac/rbacConfig";

export const addressRouter = express.Router();
// all routes require authentication — userId from JWT
addressRouter.use(
  passport.authenticate("jwt", { session: false, failWithError: true }),
);
addressRouter
  .route("/")
  .get(authorize(Permission.READ_ALL_ADDRESSES), addressController.getAll)
  .post(validationHandler(CreateAddressDto), addressController.add);
addressRouter
  .route("/:id")
  .get(
    authorize(Permission.READ_ADDRESS),
    validationHandler(idParamDto, "params"),
    addressController.getById,
  )
  .patch(
    authorize(Permission.UPDATE_ADDRESS),
    validationHandler(idParamDto, "params"),
    validationHandler(UpdateAddressDto),
    addressController.update,
  )
  .delete(
    authorize(Permission.DELETE_ADDRESS),
    validationHandler(idParamDto, "params"),
    addressController.remove,
  );

// addressRouter.delete("/:id", authenticate, addressController.remove);
// addressRouter.patch("/:id/default", authenticate, addressController.setDefault);
