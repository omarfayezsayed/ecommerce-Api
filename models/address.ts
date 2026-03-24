import { Schema } from "mongoose";
export interface IAddress {
  id: string;
  city: string;
  street: string;
  floorNumber: number;
  phone: string;
  postalCode: string;
}
export interface addressDocument extends IAddress {}
export const addressSchema = new Schema<addressDocument>({
  city: { type: String, required: true },
  street: { type: String, required: true },
  floorNumber: { type: Number, required: true },
  phone: { type: String, required: true },
  postalCode: { type: String, required: true },
});
