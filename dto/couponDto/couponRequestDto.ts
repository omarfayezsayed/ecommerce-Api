import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from "class-validator";
import { Expose, Type } from "class-transformer";
export class CreateCouponDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Expose()
  @IsDate()
  @IsNotEmpty()
  expire!: Date;

  @Expose()
  @Type(() => Number)
  @IsNumber()
  discount!: number;
}

export class UpdateCouponDto {
  @Expose()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @Expose()
  @IsOptional()
  @IsDate()
  @IsNotEmpty()
  expire?: Date;

  @Expose()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  discount?: number;
}
