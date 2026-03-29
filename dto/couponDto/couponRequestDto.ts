import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from "class-validator";
import { Type } from "class-transformer";
export class CreateCouponDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsDate()
  @IsNotEmpty()
  expire!: Date;

  @Type(() => Number)
  @IsNumber()
  discount!: number;
}

export class UpdateCouponDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsDate()
  @IsNotEmpty()
  expire?: Date;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  discount?: number;
}
