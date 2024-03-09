// import { Request, Response, NextFunction, response } from "express";
// import { Subcategory } from "../models/subCategory";
// import { asyncWrapper } from "../utils/asyncWrapper";
// import { apiError } from "../utils/apiError";
// import { StatusCodes } from "http-status-codes";

// export const createSubCategoryHandler = asyncWrapper(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const subCategory = await Subcategory.create(req.body);
//     res.status(StatusCodes.CREATED).json({
//       status: "success",
//       data: subCategory,
//     });
//   }
// );

// export const getAllSubCategoriesHandler = asyncWrapper(
//   async (req: Request, res: Response, next: NextFunction) => {
//     let filter: object = {};
//     if (req.params.id) {
//       filter = {
//         category: req.params.id,
//       };
//     }
//     const subCategories = await Subcategory.find(filter).populate({
//       path: "category",
//       select: "name -_id",
//     });

//     res.status(StatusCodes.OK).json({
//       status: "success",
//       records: subCategories.length,
//       data: subCategories,
//     });
//   }
// );

// export const getSubCategoryHandler = asyncWrapper(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const subCategory = await Subcategory.findById(req.params.id);
//     if (!subCategory) {
//       return next(
//         new apiError(
//           "No subCategory with that id please try antoher id",
//           StatusCodes.NOT_FOUND
//         )
//       );
//     }
//     res.status(StatusCodes.OK).json({
//       status: "success",
//       data: subCategory,
//     });
//   }
// );

// export const updateSubCategoryHandler = asyncWrapper(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const subCategory = await Subcategory.findByIdAndUpdate(
//       { _id: req.params.id },
//       req.body,
//       {
//         new: true,
//         runValidators: true,
//       }
//     );
//     if (!subCategory) {
//       return next(
//         new apiError(
//           "No subCategory with that id please try antoher id",
//           StatusCodes.NOT_FOUND
//         )
//       );
//     }
//     res.status(StatusCodes.OK).json({
//       status: "success",
//       data: subCategory,
//     });
//   }
// );

// export const deleteSubCategoryHandler = asyncWrapper(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const subCategory = await Subcategory.deleteOne({ _id: req.params.id });
//     if (!subCategory.deletedCount) {
//       return next(
//         new apiError(
//           "no category with that id please try with another existence id",
//           StatusCodes.NOT_FOUND
//         )
//       );
//     }
//     res.status(StatusCodes.OK).json({
//       status: "success",
//       data: subCategory,
//     });
//   }
// );
