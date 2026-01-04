import { brandDocument } from "../../models/brand";

export interface BrandQuery {
  existsById(id: string): Promise<boolean>;
}
