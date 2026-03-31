import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";
import { Type } from "class-transformer";

export class AddCartItemDto {
  @IsMongoId()
  productId!: string;

  @IsMongoId()
  @IsOptional()
  variantId?: string;

  @IsMongoId()
  @IsOptional()
  sizeId?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  quantity!: number;
}

export class UpdateCartItemDto {
  @IsMongoId()
  productId!: string;

  @IsMongoId()
  @IsOptional()
  variantId?: string;

  @IsMongoId()
  @IsOptional()
  sizeId?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  quantity!: number;
}

export class RemoveCartItemDto {
  @IsMongoId()
  productId!: string;

  @IsMongoId()
  @IsOptional()
  variantId?: string;

  @IsMongoId()
  @IsOptional()
  sizeId?: string;
}

export class ApplyCouponDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}
