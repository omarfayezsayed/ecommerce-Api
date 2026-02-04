// import { toSubCategoryProductResponseDto } from "./subCategoryMapper";
// import { toBrandResponseDto } from "./brandMapper";
// import { toCategoryResponseDto } from "./categoryMapper";
// import { productDocumnet } from "../models/product";
// import { productResponseDto } from "../dto/productDto/productResponseDto";
// import mongoose from "mongoose";

// export const toProductResponseDto = (product: productDocumnet) => {
//   const {
//     id,
//     title,
//     slug,
//     quantity,
//     sold,
//     price,
//     description,
//     category,
//     subCategory,
//     brand,
//     priceAfterDiscount,
//     ratingsAverage,
//     ratingsQuantity,
//     images,
//     imageCover,
//     colors,
//   } = product;

//   const resProduct: productResponseDto = {
//     title,
//     id,
//     slug,
//     quantity,
//     sold,
//     price,
//     description,
//     priceAfterDiscount,
//     ratingsAverage,
//     ratingsQuantity,
//     images,
//     imageCover,
//     colors,
//   };
//   if (typeof category != "undefined" && category != null)
//     resProduct["category"] =
//       category instanceof mongoose.Types.ObjectId
//         ? category.toString()
//         : toCategoryResponseDto(category);

//   if (typeof brand != "undefined" && brand != null)
//     resProduct["brand"] =
//       brand instanceof mongoose.Types.ObjectId
//         ? brand.toString()
//         : toBrandResponseDto(brand);

//   if (typeof subCategory != "undefined" && subCategory != null)
//     resProduct["subCategory"] =
//       subCategory instanceof mongoose.Types.ObjectId
//         ? subCategory.toString()
//         : toSubCategoryProductResponseDto(subCategory);

//   return resProduct;
// };

// //  title: string;
// //   slug: string;
// //   quantity: number;
// //   sold: number;
// //   price: number;
// //   description: string;
// //   category: categoryDocumnet | string;
// //   subCategory?: subCategoryDocument | string;
// //   brand?: brandDocument | string;
// //   priceAfterDiscount?: number;
// //   ratingsAverage?: number;
// //   ratingsQuantity?: number;
// //   images?: [string];
// //   imageCover: string;
// //   colors?: [string];
