import {
  IsMongoId,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from "class-validator";
import { Expose } from "class-transformer";
import { Types } from "mongoose";
export class createBrandDto {
  @Expose()
  @IsString()
  @Length(3, 15)
  name!: string;

  @Expose()
  @IsString()
  @IsOptional()
  @MinLength(5)
  slug!: string;

  @Expose()
  @IsString()
  @IsOptional()
  @MinLength(5)
  image!: string;
}

export class updateBrandDto {
  @Expose()
  @IsString()
  @Length(3, 15)
  @IsOptional()
  name!: string;

  @Expose()
  @IsString()
  @IsOptional()
  @MinLength(5)
  slug!: string;

  @Expose()
  @IsString()
  @IsOptional()
  @MinLength(5)
  image!: string;
}
