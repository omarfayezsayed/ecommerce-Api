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

export enum ProductType {
  SIMPLE = "simple",
  SIZES = "sizes_only",
  COLORS = "variant",
  SIZES_COLORS = "variant_with_sizes",
}
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
  name!: string;
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

// export class SizeInColorDto extends PriceStockDto {
//   @IsString()
//   @IsNotEmpty()
//   size!: string;
// }

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
  @Type(() => SizeDto)
  @ArrayMinSize(1)
  sizes!: SizeDto[];
}

class BaseProductDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsMongoId()
  category!: string;

  @IsOptional()
  @IsMongoId()
  subCategory?: string;

  @IsOptional()
  @IsMongoId()
  brand?: string;

  @IsEnum(ProductType)
  productType!: ProductType;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  priceAfterDiscount!: Number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  basePrice?: number;
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
  @IsString()
  slug?: string;

  @IsOptional()
  @IsMongoId()
  category?: string;

  @IsOptional()
  @IsMongoId()
  subCategory?: string;

  @IsOptional()
  @IsMongoId()
  brand?: string;

  @IsOptional()
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  priceAfterDiscount!: Number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  basePrice?: number;
}

export function createDtoByType(type: ProductType) {
  switch (type) {
    case ProductType.SIMPLE:
      return CreateSimpleProductDto;
    case ProductType.SIZES:
      return CreateSizesProductDto;
    case ProductType.COLORS:
      return CreateColorsProductDto;
    case ProductType.SIZES_COLORS:
      return CreateSizesColorsProductDto;
    default:
      return CreateSimpleProductDto;
  }
}
