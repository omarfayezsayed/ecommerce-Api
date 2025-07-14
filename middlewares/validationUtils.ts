import { check } from "express-validator";
export const validateName = (minLength: number, maxLength: number) => {
  return check("name")
    .notEmpty()
    .isLength({ min: minLength, max: maxLength })
    .withMessage(
      `name must be string with length between (${minLength},${maxLength})`
    );
};

export const validateNameOptional = (minLength: number, maxLength: number) => {
  return check("name")
    .optional()
    .notEmpty()
    .isLength({ min: minLength, max: maxLength })
    .withMessage(
      `name must be string with length between (${minLength},${maxLength})`
    );
};

export const validateId = check("id")
  .isMongoId()
  .withMessage("id should be a valid mongo Id");

const optionalNotEmpty = (filed: string, message: string) => {
  return check(filed).optional().notEmpty().withMessage(message);
};
export const validateSlug = optionalNotEmpty(
  "slug",
  "slug sholud be not empty"
);
export const validateImage = optionalNotEmpty(
  "image",
  "image sholud be not empty"
);
