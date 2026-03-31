import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from "class-validator";
import { Type } from "class-transformer";
export class CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @IsNotEmpty()
  street!: string;

  @Type(() => Number)
  @IsNumber()
  quantity!: number;
  floorNumber!: number;

  @IsPhoneNumber("EG")
  @IsNotEmpty()
  phone!: string;

  @IsString()
  @IsNotEmpty()
  postalCode!: string;
}

export class UpdateAddressDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  city?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  street?: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  quantity?: number;
  floorNumber?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsPhoneNumber("EG")
  phone?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  postalCode?: string;
}
