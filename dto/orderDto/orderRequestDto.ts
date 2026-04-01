import { IsIn, IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";
import { OrderStatus, PaymentMethod } from "../../models/order";

export class PlaceOrderDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(["cash", "card"])
  paymentMethod!: PaymentMethod;

  @IsOptional()
  //   @IsUrl()
  successUrl?: string;

  @IsOptional()
  //   @IsUrl()
  cancelUrl?: string;
}

export class UpdateOrderStatusDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(["pending", "confirmed", "shipped", "delivered"])
  status!: OrderStatus;
}
