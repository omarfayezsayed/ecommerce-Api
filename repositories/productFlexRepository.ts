// // Repository interfaces and DTO unions for the flexible product model.
// import { ProductType } from "../domain/productFlex";
// import { ProductFlexDocument } from "../models/productFlex";
// import {
//   CreateColorsProductDto,
//   CreateSimpleProductDto,
//   CreateSizesColorsProductDto,
//   CreateSizesProductDto,
//   UpdateProductDto,
// } from "../dto/productFlex.dto";

// export type CreateProductInput =
//   | CreateSimpleProductDto
//   | CreateSizesProductDto
//   | CreateColorsProductDto
//   | CreateSizesColorsProductDto;

// export interface ProductQuery {
//   page?: number;
//   limit?: number;
//   sort?: string;
//   search?: string;
//   productType?: ProductType;
//   category?: string;
//   brand?: string;
//   isActive?: boolean;
// }

// export interface PaginatedResult<T> {
//   data: T[];
//   total: number;
//   page: number;
//   limit: number;
// }

// export interface IProductFlexRepository {
//   create(data: CreateProductInput): Promise<ProductFlexDocument>;
//   update(
//     id: string,
//     data: UpdateProductDto,
//   ): Promise<ProductFlexDocument | null>;
//   findById(id: string): Promise<ProductFlexDocument | null>;
//   findAll(query: ProductQuery): Promise<PaginatedResult<ProductFlexDocument>>;
//   delete(id: string): Promise<ProductFlexDocument | null>;

//   addImages(id: string, images: string[]): Promise<ProductFlexDocument | null>;

//   addVariant(id: string, variant: any): Promise<ProductFlexDocument | null>;
//   updateVariant(
//     id: string,
//     variantId: string,
//     variant: any,
//   ): Promise<ProductFlexDocument | null>;
//   deleteVariant(
//     id: string,
//     variantId: string,
//   ): Promise<ProductFlexDocument | null>;
//   updateVariantImages(
//     id: string,
//     variantId: string,
//     images: string[],
//   ): Promise<ProductFlexDocument | null>;

//   addVariantSize(
//     id: string,
//     variantId: string,
//     size: any,
//   ): Promise<ProductFlexDocument | null>;
//   updateVariantSize(
//     id: string,
//     variantId: string,
//     sizeId: string,
//     size: any,
//   ): Promise<ProductFlexDocument | null>;
//   deleteVariantSize(
//     id: string,
//     variantId: string,
//     sizeId: string,
//   ): Promise<ProductFlexDocument | null>;
// }
