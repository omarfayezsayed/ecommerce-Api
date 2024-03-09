import { NextFunction } from "express";
import {
  check,
  Result,
  validationResult,
  ValidationError,
} from "express-validator";

export const createCategoryValidations = [
  check("name")
    .notEmpty()
    .isLength({ min: 3, max: 15 })
    .withMessage("name must be string with length between (3,10)"),
  check("slug").optional().notEmpty().withMessage("slug sholud be not empty"),
  check("image").optional().notEmpty().withMessage("image sholud be not empty"),
];

export const getCategoryValidations = [
  check("id").isMongoId().withMessage("id should be a valid mongo Id"),
];

export const deleteCategoryValidations = [
  check("id").isMongoId().withMessage("id should be a valid mongo Id"),
];

export const updateCategoryValidations = [
  check("id").isMongoId().withMessage("id should be a valid mongo Id"),
  check("name")
    .optional()
    .isLength({ min: 3, max: 15 })
    .withMessage("name must be string with length between (3,10)"),
  check("slug").optional().notEmpty().withMessage("slug sholud be not empty"),
  check("image").optional().notEmpty().withMessage("image sholud be not empty"),
];
