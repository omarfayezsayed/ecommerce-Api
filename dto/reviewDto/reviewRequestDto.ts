import {
  IsMongoId,
  IsOptional,
  IsString,
  Length,
  MinLength,
  IsNotEmpty,
  min,
  IsNumber,
  Min,
  Max,
} from "class-validator";
import { Expose, Type } from "class-transformer";
export class createReviewDto {
  @Expose()
  @IsString()
  @IsOptional()
  content?: string;

  @Expose()
  @IsMongoId()
  productId!: string;

  @Expose()
  @IsMongoId()
  userId!: string;

  @Expose()
  @Type(() => Number)
  @IsNumber()
  @Min(1, { message: "rating must be at greater thatn or equal one" })
  @Max(5, { message: "rating must be less than 5" })
  ratings!: number;
}

export class updateReviewDto {
  @Expose()
  @Type(() => Number)
  @IsNumber()
  @Min(1, { message: "rating must be at greater thatn or equal one" })
  @Max(5, { message: "rating must be less than 5" })
  ratings!: number;

  @Expose()
  @IsString()
  @IsOptional()
  content?: string;
}
