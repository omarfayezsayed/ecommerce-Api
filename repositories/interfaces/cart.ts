import { ClientSession } from "mongoose";
import { CartDocument } from "../../models/cart";

export interface CartRepository {
  findByUserId(userId: string): Promise<CartDocument | null>;
  getOrCreate(userId: string): Promise<CartDocument>;
  save(cart: CartDocument, session?: ClientSession): Promise<CartDocument>;
  clear(userId: string, session?: ClientSession): Promise<CartDocument | null>;
}
