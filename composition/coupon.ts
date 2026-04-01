import { CouponController } from "../controllers/coupon";
import { MongoCouponRepository } from "../repositories/mongoCoupon";
import { CouponService } from "../services/coupon";
const mongoCouponRepository = new MongoCouponRepository();
export const couponService = new CouponService(mongoCouponRepository);

export const couponController = new CouponController(couponService);
