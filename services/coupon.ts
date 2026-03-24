// services/coupon.service.ts
import { StatusCodes } from "http-status-codes";
import { apiError } from "../utils/apiError";
import { MongoCouponRepository } from "../repositories/mongoCoupon";
import {
  CreateCouponDto,
  UpdateCouponDto,
} from "../dto/couponDto/couponRequestDto";

export class CouponService {
  constructor(private readonly couponRepository: MongoCouponRepository) {}

  public getAll = async () => {
    return await this.couponRepository.findAll();
  };

  public getById = async (id: string) => {
    const coupon = await this.couponRepository.findById(id);
    if (!coupon) throw new apiError("Coupon not found", StatusCodes.NOT_FOUND);
    return coupon;
  };

  public create = async (data: CreateCouponDto) => {
    // [STEP 1] check if coupon name already exists
    const exists = await this.couponRepository.findByName(data.name);
    if (exists)
      throw new apiError("Coupon name already exists", StatusCodes.BAD_REQUEST);

    // [STEP 2] check expire date is in the future
    if (new Date(data.expire) < new Date())
      throw new apiError(
        "Expire date must be in the future",
        StatusCodes.BAD_REQUEST,
      );

    // [STEP 3] check discount is between 1 and 100
    if (data.discount < 1 || data.discount > 100)
      throw new apiError(
        "Discount must be between 1 and 100",
        StatusCodes.BAD_REQUEST,
      );

    return await this.couponRepository.create(data);
  };

  public update = async (id: string, data: UpdateCouponDto) => {
    // [STEP 1] check coupon exists
    const coupon = await this.couponRepository.findById(id);
    if (!coupon) throw new apiError("Coupon not found", StatusCodes.NOT_FOUND);

    // [STEP 2] check new name is not taken
    if (data.name && data.name !== coupon.name) {
      const exists = await this.couponRepository.findByName(data.name);
      if (exists)
        throw new apiError(
          "Coupon name already exists",
          StatusCodes.BAD_REQUEST,
        );
    }

    // [STEP 3] check expire date is in the future
    if (data.expire && new Date(data.expire) < new Date())
      throw new apiError(
        "Expire date must be in the future",
        StatusCodes.BAD_REQUEST,
      );

    // [STEP 4] check discount is between 1 and 100
    if (data.discount && (data.discount < 1 || data.discount > 100))
      throw new apiError(
        "Discount must be between 1 and 100",
        StatusCodes.BAD_REQUEST,
      );

    return await this.couponRepository.update(id, data);
  };

  public delete = async (id: string) => {
    const coupon = await this.couponRepository.findById(id);
    if (!coupon) throw new apiError("Coupon not found", StatusCodes.NOT_FOUND);

    return await this.couponRepository.delete(id);
  };

  // validate coupon — used when applying coupon to cart/order
  public validate = async (name: string) => {
    const coupon = await this.couponRepository.findValidByName(name);

    if (!coupon)
      throw new apiError("Invalid or expired coupon", StatusCodes.BAD_REQUEST);

    return coupon;
  };
}

// export const couponService = new CouponService(couponRepository);
