// repositories/coupon.repository.ts
import { Coupon, couponDocumnet } from "../models/coupon";
import { ICoupon } from "../models/coupon";

export class MongoCouponRepository {
  async findAll(): Promise<couponDocumnet[]> {
    const coupons: couponDocumnet[] = await Coupon.find().sort({
      createdAt: -1,
    });

    return coupons;
  }

  async findById(id: string): Promise<couponDocumnet | null> {
    return await Coupon.findById(id);
  }

  async findByName(name: string): Promise<couponDocumnet | null> {
    return await Coupon.findOne({ name });
  }

  async create(data: Partial<ICoupon>): Promise<couponDocumnet> {
    return await Coupon.create(data);
  }

  async update(
    id: string,
    data: Partial<ICoupon>,
  ): Promise<couponDocumnet | null> {
    return await Coupon.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id: string): Promise<couponDocumnet | null> {
    return await Coupon.findByIdAndDelete(id);
  }

  // check if coupon is valid — not expired
  async findValidByName(name: string): Promise<couponDocumnet | null> {
    return await Coupon.findOne({
      name,
      expire: { $gt: new Date() }, // expire date must be in the future
    });
  }
}
