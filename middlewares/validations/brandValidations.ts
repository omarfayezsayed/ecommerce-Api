import { check } from "express-validator";
import {
  validateId,
  validateName,
  validateNameOptional,
  validateImage,
  validateSlug,
} from "../validationUtils";

export const getBrandValidations = validateId;

export const createBrandValidations = [
  validateName(3, 15),
  validateImage,
  validateSlug,
];

export const deleteBrandValidations = [validateId];
export const updateBrandValidations = [
  validateId,
  validateNameOptional(3, 15),
  validateImage,
  validateSlug,
];
