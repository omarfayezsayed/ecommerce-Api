import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from "class-validator";
import { Expose } from "class-transformer";
export class createSubCategoryDto {
  @Expose()
  @IsString()
  @Length(3, 15)
  name!: string;

  @Expose()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  slug!: string;

  @Expose()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  image!: string;

  @Expose()
  @IsMongoId()
  @IsString()
  category!: string;
}

export class updateSubCategoryDto {
  @Expose()
  @IsString()
  @Length(3, 15)
  @IsOptional()
  name!: string;

  @Expose()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  slug!: string;

  @Expose()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  image!: string;

  @Expose()
  @IsMongoId()
  @IsString()
  @IsOptional()
  category!: string;
}

export class getAllSubCategoryForMainCategory {
  @Expose()
  @IsMongoId()
  @IsString()
  @IsOptional()
  id!: string;
}
