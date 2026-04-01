import express from "express";
import passport from "../middlewares/passport/PassportRegister";
import { orderController } from "../composition/order";
import { authorize } from "../composition/rbac";
import { Permission } from "../rbac/rbacConfig";
import { validationHandler } from "../middlewares/validationHandler";
import {
  PlaceOrderDto,
  UpdateOrderStatusDto,
} from "../dto/orderDto/orderRequestDto";

export const orderRouter = express.Router();

orderRouter.post("/webhook/stripe", orderController.stripeWebhook);

orderRouter.use(
  passport.authenticate("jwt", { session: false, failWithError: true }),
);

orderRouter
  .route("/")
  .post(
    // authorize(Permission.CREATE_ORDER),s
    validationHandler(PlaceOrderDto),
    orderController.placeOrder,
  )
  .get(authorize(Permission.READ_ORDER), orderController.getMyOrders);

orderRouter
  .route("/:id")
  .get(authorize(Permission.READ_ORDER), orderController.getMyOrderById)
  .delete(authorize(Permission.DELETE_ORDER), orderController.deleteOrder);

orderRouter.patch(
  "/:id/status",
  authorize(Permission.UPDATE_ORDER_STATUS),
  validationHandler(UpdateOrderStatusDto),
  orderController.updateStatus,
);
