import {
  IsMongoId,
  IsOptional,
  IsString,
  Length,
  MinLength,
  IsNotEmpty,
  IsNumber,
  Min,
  IsArray,
} from "class-validator";
import { Type } from "class-transformer";

export class createProductDto {
  @IsString()
  @Length(10, 200)
  title!: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  slug!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1, { message: "quantity must be at least one" })
  quantity!: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  sold!: number;

  @Type(() => Number)
  @IsNumber()
  price!: number;

  @IsString()
  @MinLength(10)
  description!: string;

  @IsString()
  @IsMongoId()
  category!: string;

  @IsString()
  @IsMongoId()
  @IsOptional()
  subCategory!: string;

  @IsString()
  @IsMongoId()
  @IsOptional()
  brand!: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  priceAfterDiscount!: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  ratingsAverage!: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  ratingsQuantity!: number;

  // @Expose()
  // @IsArray()
  // @IsOptional()
  // @IsNotEmpty()
  // image!: [string];

  @IsArray()
  @IsOptional()
  @IsNotEmpty()
  colors!: [string];

  // @Expose()
  // @IsString()
  // imageCover!: string;
}

export class updateProductDto {
  @IsString()
  @Length(10, 200)
  @IsOptional()
  title!: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  slug!: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @Min(1, { message: "quantity must be at least one" })
  quantity!: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  sold!: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  price!: number;

  @IsOptional()
  @IsString()
  @MinLength(10)
  description!: string;

  @IsNotEmpty({
    message: "must provide the main category to update the product",
  })
  @IsString()
  @IsMongoId()
  category!: string;

  @IsString()
  @IsMongoId()
  @IsOptional()
  subCategory!: string;

  @IsString()
  @IsMongoId()
  @IsOptional()
  brand!: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  priceAfterDiscount!: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  ratingsAverage!: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  ratingsQuantity!: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  image!: [string];

  @IsArray()
  @IsOptional()
  @IsNotEmpty()
  colors!: [string];

  @IsOptional()
  @IsString()
  imageCover!: string;
}
