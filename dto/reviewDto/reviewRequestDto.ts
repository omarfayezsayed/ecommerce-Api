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
import { Type } from "class-transformer";
export class createReviewDto {
  @IsString()
  @IsOptional()
  content?: string;

  @IsMongoId()
  productId!: string;

  @IsMongoId()
  userId!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1, { message: "rating must be at greater thatn or equal one" })
  @Max(5, { message: "rating must be less than 5" })
  ratings!: number;
}

export class updateReviewDto {
  @Type(() => Number)
  @IsNumber()
  @Min(1, { message: "rating must be at greater thatn or equal one" })
  @Max(5, { message: "rating must be less than 5" })
  ratings!: number;

  @IsString()
  @IsOptional()
  content?: string;
}
