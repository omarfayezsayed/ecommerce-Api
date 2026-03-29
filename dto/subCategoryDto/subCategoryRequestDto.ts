import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from "class-validator";
export class createSubCategoryDto {
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

  @IsMongoId()
  @IsString()
  category!: string;
}

export class updateSubCategoryDto {
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

  @IsMongoId()
  @IsString()
  @IsOptional()
  category!: string;
}

export class getAllSubCategoryForMainCategory {
  @IsMongoId()
  @IsString()
  @IsOptional()
  id!: string;
}
