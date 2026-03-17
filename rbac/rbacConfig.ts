export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  SUPER_ADMIN = "super admin",
  GUEST = "guest",
}

export enum Permission {
  // products
  CREATE_PRODUCT = "create:product",
  READ_PRODUCT = "read:product",
  UPDATE_PRODUCT = "update:product",
  DELETE_PRODUCT = "delete:product",

  // brands
  CREATE_BRAND = "create:brand",
  READ_BRAND = "read:brand",
  UPDATE_BRAND = "update:brand",
  DELETE_BRAND = "delete:brand",

  // categories
  CREATE_CATEGORY = "create:category",
  READ_CATEGORY = "read:category",
  UPDATE_CATEGORY = "update:category",
  DELETE_CATEGORY = "delete:category",

  // subcategories
  CREATE_SUBCATEGORY = "create:subCategory",
  READ_SUBCATEGORY = "read:subCategory",
  UPDATE_SUBCATEGORY = "update:subCategory",
  DELETE_SUBCATEGORY = "delete:subCategory",

  // users
  READ_USER = "read:user",
  UPDATE_USER = "update:user",
  DELETE_USER = "delete:user",
  CREATE_USER = "create:user",

  // orders
  CREATE_ORDER = "create:order",
  READ_ORDER = "read:order",
  UPDATE_ORDER = "update:order",
  DELETE_ORDER = "delete:order",
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.USER]: [
    Permission.READ_PRODUCT,
    Permission.READ_CATEGORY,
    Permission.CREATE_ORDER,
    Permission.READ_ORDER,
    Permission.READ_BRAND,
    Permission.READ_SUBCATEGORY,
  ],

  [UserRole.ADMIN]: [
    Permission.CREATE_PRODUCT,
    Permission.READ_PRODUCT,
    Permission.UPDATE_PRODUCT,
    Permission.DELETE_PRODUCT,

    Permission.CREATE_CATEGORY,
    Permission.READ_CATEGORY,
    Permission.UPDATE_CATEGORY,
    Permission.DELETE_CATEGORY,

    Permission.CREATE_BRAND,
    Permission.READ_BRAND,
    Permission.UPDATE_BRAND,
    Permission.DELETE_BRAND,

    Permission.CREATE_SUBCATEGORY,
    Permission.READ_SUBCATEGORY,
    Permission.UPDATE_SUBCATEGORY,
    Permission.DELETE_SUBCATEGORY,

    Permission.READ_USER,
    Permission.UPDATE_USER,
    Permission.READ_ORDER,

    Permission.READ_ORDER,
    Permission.CREATE_ORDER,
    Permission.UPDATE_ORDER,
    Permission.UPDATE_ORDER,
  ],

  [UserRole.SUPER_ADMIN]: Object.values(Permission),
  [UserRole.GUEST]: [
    Permission.READ_PRODUCT,
    Permission.READ_CATEGORY,
    Permission.READ_BRAND,
    Permission.READ_SUBCATEGORY,
  ],
};
