import {
  IsMongoId,
  IsOptional,
  IsString,
  Length,
  MinLength,
  IsNotEmpty,
} from "class-validator";
export class createCategoryDto {
  @IsString()
  @Length(3, 15)
  name!: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  slug!: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  image!: string;
}

export class updateCategoryDto {
  @IsString()
  @Length(3, 15)
  @IsOptional()
  name!: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  slug!: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  image!: string;
}
