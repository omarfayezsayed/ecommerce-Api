import { check } from "express-validator";
import {
  validateName,
  validateId,
  validateImage,
  validateSlug,
  validateNameOptional,
} from "../validationUtils";
export const createSubCategoryValidations = [
  validateName(3, 15),
  validateId,
  check("category")
    .isMongoId()
    .withMessage("sub category must have a parent category"),
  validateSlug,
  validateImage,
];

export const getSubCategoryValidations = [validateId];

export const deleteSubCategoryValidations = [validateId];

export const updateSubCategoryValidations = [
  validateId,
  validateNameOptional(3, 15),
  validateSlug,
  validateImage,
  check("category")
    .optional()
    .notEmpty()
    .isMongoId()
    .withMessage("id should be valid mongo id"),
];

export const getAllSubCategoriesValidations = [
  check("id")
    .optional()
    .notEmpty()
    .isMongoId()
    .withMessage("id should be valid mongo id"),
];
