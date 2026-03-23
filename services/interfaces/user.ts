export interface IReviewUserService {
  exists(userId: string): Promise<boolean>;
}
