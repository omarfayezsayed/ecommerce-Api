import { CartDocument } from "../../models/cart";

export interface CartRepository {
  findByUserId(userId: string): Promise<CartDocument | null>;
  getOrCreate(userId: string): Promise<CartDocument>;
  save(cart: CartDocument): Promise<CartDocument>;
}
