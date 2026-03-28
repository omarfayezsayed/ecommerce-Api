import { ICreateProduct } from "../../../models/product2";

export interface ProductValidator {
  validate(data: ICreateProduct): void;
}
