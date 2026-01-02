import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { Expose } from "class-transformer";
export class createBrandDto {
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

export class updateBrandDto {
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
