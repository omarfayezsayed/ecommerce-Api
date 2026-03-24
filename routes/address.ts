// routes/address.router.ts
import express from "express";
import passport from "../middlewares/passport/PassportRegister";
import { addressController } from "../composition/address";

export const addressRouter = express.Router();
// all routes require authentication — userId from JWT
addressRouter.use(
  passport.authenticate("jwt", { session: false, failWithError: true }),
);
addressRouter
  .route("/")
  .get(addressController.getAll)
  .post(addressController.add);
addressRouter
  .route("/:id")
  .get(addressController.getById)
  .patch(addressController.update)
  .delete(addressController.remove);

// addressRouter.delete("/:id", authenticate, addressController.remove);
// addressRouter.patch("/:id/default", authenticate, addressController.setDefault);
