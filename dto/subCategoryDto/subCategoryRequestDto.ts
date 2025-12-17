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
export class createSubCategoryDto {
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

  @Expose()
  @IsMongoId()
  @IsString()
  category!: Types.ObjectId;
}

export class getSubCategoryDto {
  @Expose()
  @IsMongoId()
  @IsString()
  id!: Types.ObjectId;
}

export class deleteSubCategoryDto {
  @Expose()
  @IsMongoId()
  @IsString()
  id!: Types.ObjectId;
}

export class updateSubCategoryDto {
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

  @Expose()
  @IsMongoId()
  @IsString()
  @IsOptional()
  category!: Types.ObjectId;
}
