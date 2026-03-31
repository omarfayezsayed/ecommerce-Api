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
  READ_ALL_PRODUCTS = "read:all_products",

  // brands
  CREATE_BRAND = "create:brand",
  READ_BRAND = "read:brand",
  UPDATE_BRAND = "update:brand",
  DELETE_BRAND = "delete:brand",
  READ_ALL_BRANDS = "read:all_brands",

  // categories
  CREATE_CATEGORY = "create:category",
  READ_CATEGORY = "read:category",
  UPDATE_CATEGORY = "update:category",
  DELETE_CATEGORY = "delete:category",
  READ_ALL_CATEGORIES = "read:all_categories",

  // subcategories
  CREATE_SUBCATEGORY = "create:subCategory",
  READ_SUBCATEGORY = "read:subCategory",
  UPDATE_SUBCATEGORY = "update:subCategory",
  DELETE_SUBCATEGORY = "delete:subCategory",
  READ_ALL_SUBCATEGORIES = "read:all_subCategories",

  // users
  READ_USER = "read:user",
  UPDATE_USER = "update:user",
  DELETE_USER = "delete:user",
  CREATE_USER = "create:user",
  READ_ALL_USERS = "read:all_users",

  // orders
  CREATE_ORDER = "create:order",
  READ_ORDER = "read:order",
  UPDATE_ORDER = "update:order",
  DELETE_ORDER = "delete:order",
  READ_ALL_ORDERS = "read:all_orders",

  // reviews
  CREATE_REVIEW = "create:review",
  READ_REVIEW = "read:review",
  UPDATE_REVIEW = "update:review",
  DELETE_REVIEW = "delete:review",
  READ_ALL_REVIEWS = "read:all_reviews",

  // coupons
  CREATE_COUPON = "create:coupon",
  READ_COUPON = "read:coupon",
  UPDATE_COUPON = "update:coupon",
  DELETE_COUPON = "delete:coupon",
  READ_ALL_COUPONS = "read:all_coupons",

  // wishList
  ADD_TO_WISHLIST = "add:wishList",
  REMOVE_FROM_WISHLIST = "remove:wishList",
  READ_WISHLIST = "read:wishList",
  CLEAR_WISHLIST = "delete:wishList",

  // addresses
  CREATE_ADDRESS = "create:address",
  READ_ADDRESS = "read:address",
  UPDATE_ADDRESS = "update:address",
  DELETE_ADDRESS = "delete:address",
  READ_ALL_ADDRESSES = "read:all_addresses",

  // cart
  READ_CART = "read:cart",
  UPDATE_CART = "update:cart",
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.USER]: [
    Permission.READ_PRODUCT,
    Permission.READ_ALL_PRODUCTS,

    Permission.READ_BRAND,
    Permission.READ_ALL_BRANDS,

    Permission.READ_CATEGORY,
    Permission.READ_ALL_CATEGORIES,

    Permission.READ_SUBCATEGORY,
    Permission.READ_ALL_SUBCATEGORIES,

    Permission.CREATE_ORDER,
    Permission.READ_ORDER,
    Permission.UPDATE_ORDER,
    Permission.DELETE_ORDER,

    Permission.CREATE_REVIEW,
    Permission.READ_REVIEW,
    Permission.UPDATE_REVIEW,
    Permission.DELETE_REVIEW,
    Permission.READ_ALL_REVIEWS,

    Permission.READ_COUPON,

    Permission.ADD_TO_WISHLIST,
    Permission.REMOVE_FROM_WISHLIST,
    Permission.READ_WISHLIST,
    Permission.CLEAR_WISHLIST,

    Permission.CREATE_ADDRESS,
    Permission.READ_ADDRESS,
    Permission.UPDATE_ADDRESS,
    Permission.DELETE_ADDRESS,
    Permission.READ_ALL_ADDRESSES,

    Permission.READ_CART,
    Permission.UPDATE_CART,
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
    Permission.DELETE_ORDER,

    Permission.READ_REVIEW,
    Permission.DELETE_REVIEW,

    Permission.READ_COUPON,
    Permission.CREATE_COUPON,
    Permission.UPDATE_COUPON,
    Permission.DELETE_COUPON,
    Permission.READ_ALL_COUPONS,

    Permission.READ_ADDRESS,

    Permission.READ_CART,
    Permission.UPDATE_CART,
  ],

  [UserRole.SUPER_ADMIN]: Object.values(Permission),

  [UserRole.GUEST]: [
    Permission.READ_PRODUCT,
    Permission.READ_CATEGORY,
    Permission.READ_BRAND,
    Permission.READ_SUBCATEGORY,
  ],
};
