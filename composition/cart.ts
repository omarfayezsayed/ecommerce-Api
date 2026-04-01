import { CartController } from "../controllers/cart";
import { MongoCartRepository } from "../repositories/mongoCart";
import { MongoProductRepository } from "../repositories/mongoProduct2";
import { CartService } from "../services/cart";
import { CouponService } from "../services/coupon";
import { MongoCouponRepository } from "../repositories/mongoCoupon";

const cartRepository = new MongoCartRepository();
const productRepository = new MongoProductRepository();
const couponRepository = new MongoCouponRepository();
const couponService = new CouponService(couponRepository);

export const cartService = new CartService(
  cartRepository,
  productRepository,
  couponService,
);

export const cartController = new CartController(cartService);
