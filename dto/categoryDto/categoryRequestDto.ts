import {
  IsMongoId,
  IsOptional,
  IsString,
  Length,
  MinLength,
  validate,
} from "class-validator";
import { Expose } from "class-transformer";
export class createCategoryDto {
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

export class updateCategoryDto {
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
