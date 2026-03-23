export interface IReviewProductService {
  exists(productId: string): Promise<boolean>;
  updateRatings(
    productId: string,
    avgRating: number,
    ratungQuantity: number,
  ): Promise<void>;
}
