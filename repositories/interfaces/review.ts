import { Ireview, reviewDocument } from "../../models/review";

export interface ReviewRepository {
  findAll(id?: string, queryObj?: any): Promise<Array<reviewDocument>>;
  findOne(id: string): Promise<reviewDocument | null>;
  deleteOne(id: string): Promise<reviewDocument | null>;
  createOne(data: Partial<Ireview>): Promise<reviewDocument>;
  updateOne(id: string, data: Partial<Ireview>): Promise<reviewDocument | null>;
  calcRatings(
    productId: string,
  ): Promise<{ avgRatings: number; ratingsQuantity: number }>;
}
