import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from "class-validator";
import { Expose, Type } from "class-transformer";
export class CreateAddressDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  city!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  street!: string;

  @Expose()
  @Type(() => Number)
  @IsNumber()
  quantity!: number;
  floorNumber!: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  postalCode!: string;
}

export class UpdateAddressDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  city!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  street!: string;

  @Expose()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  quantity!: number;
  floorNumber!: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  phone!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  postalCode!: string;
}
