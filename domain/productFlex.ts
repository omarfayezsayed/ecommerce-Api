// Domain types for flexible products (simple, sizes, colors, sizes+colors).
// Discriminated unions keep variants explicit and avoid nullable chaos.

export type ProductType = "simple" | "sizes" | "colors" | "sizes_colors";

export interface PriceStock {
  price: number;
  stock: number;
}

export interface SizeValue extends PriceStock {
  size: string;
}

export interface ColorValue extends PriceStock {
  color: string;
  images?: string[];
}

export interface SizeColorValue extends PriceStock {
  size: string;
}

export interface ColorWithSizes {
  color: string;
  images?: string[];
  sizes: SizeColorValue[];
}

export interface BaseProduct {
  id?: string;
  title: string;
  description: string;
  category: string;
  brand?: string;
  productType: ProductType;
  isActive?: boolean;
  priceAfterDiscount?: number;
  slug?: string;
  images?: string[];
  imageCover?: string;
}

export interface SimpleProduct extends BaseProduct, PriceStock {
  productType: "simple";
  variants?: never;
  sizes?: never;
}

export interface SizesProduct extends BaseProduct {
  productType: "sizes";
  sizes: SizeValue[];
  variants?: never;
  price?: never;
  stock?: never;
}

export interface ColorsProduct extends BaseProduct {
  productType: "colors";
  variants: ColorValue[];
  sizes?: never;
  price?: never;
  stock?: never;
}

export interface SizesColorsProduct extends BaseProduct {
  productType: "sizes_colors";
  variants: ColorWithSizes[];
  sizes?: never;
  price?: never;
  stock?: never;
}

export type ProductUnion =
  | SimpleProduct
  | SizesProduct
  | ColorsProduct
  | SizesColorsProduct;
