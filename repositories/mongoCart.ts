import { ClientSession } from "mongoose";
import { CartModel, CartDocument } from "../models/cart";
import { CartRepository } from "./interfaces/cart";

export class MongoCartRepository implements CartRepository {
  public findByUserId = async (
    userId: string,
  ): Promise<CartDocument | null> => {
    return await CartModel.findOne({ user: userId });
  };

  public getOrCreate = async (userId: string): Promise<CartDocument> => {
    const existing = await this.findByUserId(userId);
    if (existing) return existing;
    return await CartModel.create({
      user: userId,
      items: [],
      subTotal: 0,
      total: 0,
    });
  };

  public save = async (
    cart: CartDocument,
    session?: ClientSession,
  ): Promise<CartDocument> => {
    return session ? await cart.save({ session }) : await cart.save();
  };

  public clear = async (
    userId: string,
    session?: ClientSession,
  ): Promise<CartDocument | null> => {
    return await CartModel.findOneAndUpdate(
      { user: userId },
      { items: [], subTotal: 0, total: 0, $unset: { coupon: "" } },
      { new: true, session },
    );
  };
}
