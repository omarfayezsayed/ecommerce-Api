import { OrderController } from "../controllers/order";
import { MongoOrderRepository } from "../repositories/mongoOrder";
import { OrderService } from "../services/order";
import { cartService } from "./cart";
import { couponService } from "./coupon";
import { productService } from "./product2";

const orderRepository = new MongoOrderRepository();
export const orderService = new OrderService(
  orderRepository,
  cartService,
  couponService,
  productService,
);

export const orderController = new OrderController(orderService);
