import {
  IsMongoId,
  IsOptional,
  IsString,
  Length,
  MinLength,
  IsNotEmpty,
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
  @IsNotEmpty()
  slug!: string;

  @Expose()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
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
  @IsNotEmpty()
  slug!: string;

  @Expose()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  image!: string;
}
