import {
  IsMongoId,
  IsOptional,
  IsString,
  Length,
  MinLength,
  validate,
} from "class-validator";
import { Expose } from "class-transformer";
import { Types } from "mongoose";
export class createBrandDto {
  @Expose()
  @IsString()
  @Length(3, 15)
  name!: String;

  @Expose()
  @IsString()
  @IsOptional()
  @MinLength(5)
  slug!: String;

  @Expose()
  @IsString()
  @IsOptional()
  @MinLength(5)
  image!: String;
}

export class getBrandDto {
  @Expose()
  @IsMongoId()
  @IsString()
  id!: Types.ObjectId;
}

export class deleteBrandDto {
  @Expose()
  @IsMongoId()
  @IsString()
  id!: Types.ObjectId;
}

export class updateBrandDto {
  @Expose()
  @IsMongoId()
  @IsString()
  id!: Types.ObjectId;

  @Expose()
  @IsString()
  @Length(3, 15)
  @IsOptional()
  name!: String;

  @Expose()
  @IsString()
  @IsOptional()
  @MinLength(5)
  slug!: String;

  @Expose()
  @IsString()
  @IsOptional()
  @MinLength(5)
  image!: String;
}
