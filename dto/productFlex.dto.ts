// DTOs with class-validator to gate request payloads per product type.
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  ValidateNested,
  ArrayMinSize,
  ArrayUnique,
} from "class-validator";
import { Type } from "class-transformer";
import { ProductType } from "../domain/productFlex";

class PriceStockDto {
  @IsPositive()
  price!: number;

  @IsNumber()
  @Min(0)
  stock!: number;
}

export class SizeDto extends PriceStockDto {
  @IsString()
  @IsNotEmpty()
  size!: string;
}

export class ColorDto extends PriceStockDto {
  @IsString()
  @IsNotEmpty()
  color!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}

export class SizeInColorDto extends PriceStockDto {
  @IsString()
  @IsNotEmpty()
  size!: string;
}

export class ColorWithSizesDto {
  @IsString()
  @IsNotEmpty()
  color!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SizeInColorDto)
  @ArrayMinSize(1)
  sizes!: SizeInColorDto[];
}

class BaseProductDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsMongoId()
  category!: string;

  @IsOptional()
  @IsMongoId()
  brand?: string;

  @IsEnum(["simple", "sizes", "colors", "sizes_colors"])
  productType!: ProductType;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsString()
  imageCover?: string;
}

export class CreateSimpleProductDto extends BaseProductDto {
  @IsPositive()
  price!: number;

  @IsNumber()
  @Min(0)
  stock!: number;
}

export class CreateSizesProductDto extends BaseProductDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SizeDto)
  @ArrayMinSize(1)
  sizes!: SizeDto[];
}

export class CreateColorsProductDto extends BaseProductDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ColorDto)
  @ArrayMinSize(1)
  variants!: ColorDto[];
}

export class CreateSizesColorsProductDto extends BaseProductDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ColorWithSizesDto)
  @ArrayMinSize(1)
  variants!: ColorWithSizesDto[];
}

// Update DTO is lenient but will be revalidated per product type using merged data.
export class UpdateProductDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsMongoId()
  category?: string;

  @IsOptional()
  @IsMongoId()
  brand?: string;

  @IsOptional()
  @IsEnum(["simple", "sizes", "colors", "sizes_colors"])
  productType?: ProductType;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsString()
  imageCover?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SizeDto)
  sizes?: SizeDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ColorDto)
  variants?: ColorDto[] | ColorWithSizesDto[];

  @IsOptional()
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;
}

export function createDtoByType(type: ProductType) {
  switch (type) {
    case "simple":
      return CreateSimpleProductDto;
    case "sizes":
      return CreateSizesProductDto;
    case "colors":
      return CreateColorsProductDto;
    case "sizes_colors":
      return CreateSizesColorsProductDto;
    default:
      return CreateSimpleProductDto;
  }
}
