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
import { Expose, Type } from "class-transformer";
// import "reflect-metadata";
export class createProductDto {
  @Expose()
  @IsString()
  @Length(10, 200)
  title!: string;

  @Expose()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  slug!: string;

  @Expose()
  @Type(() => Number)
  @IsNumber()
  @Min(1, { message: "quantity must be at least one" })
  quantity!: number;

  @Expose()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  sold!: number;

  @Expose()
  @Type(() => Number)
  @IsNumber()
  price!: number;

  @Expose()
  @IsString()
  @MinLength(10)
  description!: string;

  @Expose()
  @IsString()
  @IsMongoId()
  category!: string;

  @Expose()
  @IsString()
  @IsMongoId()
  @IsOptional()
  subCategory!: string;

  @Expose()
  @IsString()
  @IsMongoId()
  @IsOptional()
  brand!: string;

  @Expose()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  priceAfterDiscount!: number;

  @Expose()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  ratingsAverage!: number;

  @Expose()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  ratingsQuantity!: number;

  // @Expose()
  // @IsArray()
  // @IsOptional()
  // @IsNotEmpty()
  // image!: [string];

  @Expose()
  @IsArray()
  @IsOptional()
  @IsNotEmpty()
  colors!: [string];

  // @Expose()
  // @IsString()
  // imageCover!: string;
}

export class updateProductDto {
  @Expose()
  @IsString()
  @Length(10, 200)
  @IsOptional()
  title!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  slug!: string;

  @Expose()
  @IsNumber()
  @IsOptional()
  @Min(1, { message: "quantity must be at least one" })
  quantity!: number;

  @Expose()
  @IsNumber()
  @IsOptional()
  sold!: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  price!: number;

  @Expose()
  @IsOptional()
  @IsString()
  @MinLength(10)
  description!: string;

  @Expose()
  @IsNotEmpty({
    message: "must provide the main category to update the product",
  })
  @IsString()
  @IsMongoId()
  category!: string;

  @Expose()
  @IsString()
  @IsMongoId()
  @IsOptional()
  subCategory!: string;

  @Expose()
  @IsString()
  @IsMongoId()
  @IsOptional()
  brand!: string;

  @Expose()
  @IsNumber()
  @IsOptional()
  priceAfterDiscount!: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  ratingsAverage!: number;

  @Expose()
  @IsNumber()
  @IsOptional()
  ratingsQuantity!: number;

  @Expose()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  image!: [string];

  @Expose()
  @IsArray()
  @IsOptional()
  @IsNotEmpty()
  colors!: [string];

  @Expose()
  @IsOptional()
  @IsString()
  imageCover!: string;
}
