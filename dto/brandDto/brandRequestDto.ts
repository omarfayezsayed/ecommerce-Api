import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
export class createBrandDto {
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

export class updateBrandDto {
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
