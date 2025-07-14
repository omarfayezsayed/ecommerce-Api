import { check } from "express-validator";
import {
  validateName,
  validateId,
  validateImage,
  validateSlug,
  validateNameOptional,
} from "../validationUtils";

export const createCategoryValidations = [
  validateName(3, 15),
  validateSlug,
  validateImage,
];

export const getCategoryValidations = [validateId];

export const deleteCategoryValidations = [validateId];

export const updateCategoryValidations = [
  validateId,
  validateNameOptional(3, 15),
  validateSlug,
  validateImage,
];
