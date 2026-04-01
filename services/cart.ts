import { StatusCodes } from "http-status-codes";
import { ClientSession } from "mongoose";
import { CartRepository } from "../repositories/interfaces/cart";
import { apiError } from "../utils/apiError";
import { MongoProductRepository } from "../repositories/mongoProduct2";
import { CouponService } from "./coupon";
import { CartDocument } from "../models/cart";
import { ProductType, IVariant, ISize } from "../models/product2";
import {
  AddCartItemDto,
  ApplyCouponDto,
  RemoveCartItemDto,
  UpdateCartItemDto,
} from "../dto/cartDto/cartRequestDto";

const ERRORS = {
  CART_ITEM_NOT_FOUND: "Cart item not found",
  PRODUCT_NOT_FOUND: "Product not found",
  INVALID_VARIANT: "Invalid variant for this product",
  INVALID_SIZE: "Invalid size for this product",
  INVALID_PRODUCT_TYPE: "Invalid product type for this operation",
  PRICE_NOT_AVAILABLE: "Price is not available for this product selection",
  STOCK_NOT_AVAILABLE: "Stock is not available for this product selection",
  INSUFFICIENT_STOCK: "Insufficient stock",
} as const;

type ResolvedPriceStock = { price: number; stock: number };
type CartSelection = { variantId?: string; sizeId?: string };
type CartItemView = {
  productId: string;
  variantId?: string;
  sizeId?: string;
  title: string;
  image?: string;
  color?: string;
  size?: string;
  quantity: number;
  price: number;
};
type CartView = {
  id: string;
  user: string;
  items: CartItemView[];
  coupon?: string;
  subTotal: number;
  total: number;
};

type ProductTypeStrategy = {
  resolve: (product: any, selection: CartSelection) => ResolvedPriceStock;
  validateItem: (product: any, selection: CartSelection) => void;
};

export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly productRepository: MongoProductRepository,
    private readonly couponService: CouponService,
  ) {}

  public getCart = async (userId: string): Promise<CartView> => {
    const cart = await this.cartRepository.getOrCreate(userId);
    return await this.buildCartResponse(cart);
  };

  public addItem = async (
    userId: string,
    data: AddCartItemDto,
  ): Promise<CartDocument> => {
    const cart = await this.cartRepository.getOrCreate(userId);
    const { price, stock } = await this.resolvePriceAndStock(data);

    const existing = this.findItem(
      cart,
      data.productId,
      data.variantId,
      data.sizeId,
    );

    if (existing) {
      const nextQty = existing.quantity + data.quantity;
      if (nextQty > stock)
        throw new apiError(ERRORS.INSUFFICIENT_STOCK, StatusCodes.BAD_REQUEST);
      existing.quantity = nextQty;
    } else {
      if (data.quantity > stock)
        throw new apiError(ERRORS.INSUFFICIENT_STOCK, StatusCodes.BAD_REQUEST);
      cart.items.push({
        product: data.productId as any,
        quantity: data.quantity,
        price,
        variantId: data.variantId,
        sizeId: data.sizeId,
      });
    }

    await this.recomputeTotals(cart);
    return await this.cartRepository.save(cart);
  };

  public updateItemQuantity = async (
    userId: string,
    data: UpdateCartItemDto,
  ): Promise<CartDocument> => {
    const cart = await this.cartRepository.getOrCreate(userId);
    const existing = this.findItem(
      cart,
      data.productId,
      data.variantId,
      data.sizeId,
    );
    if (!existing)
      throw new apiError(ERRORS.CART_ITEM_NOT_FOUND, StatusCodes.NOT_FOUND);

    if (data.quantity === 0) {
      const filtered = cart.items.filter(
        (item) =>
          !this.isSameItem(item, data.productId, data.variantId, data.sizeId),
      );
      cart.set("items", filtered);
      await this.recomputeTotals(cart);
      return await this.cartRepository.save(cart);
    }

    const { stock } = await this.resolvePriceAndStock(data);
    if (data.quantity > stock)
      throw new apiError(ERRORS.INSUFFICIENT_STOCK, StatusCodes.BAD_REQUEST);

    existing.quantity = data.quantity;
    await this.recomputeTotals(cart);
    return await this.cartRepository.save(cart);
  };

  public removeItem = async (
    userId: string,
    data: RemoveCartItemDto,
  ): Promise<CartDocument> => {
    const cart = await this.cartRepository.getOrCreate(userId);
    const existing = this.findItem(
      cart,
      data.productId,
      data.variantId,
      data.sizeId,
    );
    if (!existing)
      throw new apiError(ERRORS.CART_ITEM_NOT_FOUND, StatusCodes.NOT_FOUND);

    const filtered = cart.items.filter(
      (item) =>
        !this.isSameItem(item, data.productId, data.variantId, data.sizeId),
    );
    cart.set("items", filtered);
    await this.recomputeTotals(cart);
    return await this.cartRepository.save(cart);
  };

  public applyCoupon = async (
    userId: string,
    data: ApplyCouponDto,
  ): Promise<CartDocument> => {
    const cart = await this.cartRepository.getOrCreate(userId);
    const coupon = await this.couponService.validate(data.name);
    cart.coupon = coupon.name;
    await this.recomputeTotals(cart, coupon.discount);
    return await this.cartRepository.save(cart);
  };

  public removeCoupon = async (userId: string): Promise<CartDocument> => {
    const cart = await this.cartRepository.getOrCreate(userId);
    cart.coupon = undefined;
    await this.recomputeTotals(cart, 0);
    return await this.cartRepository.save(cart);
  };

  public clearForOrder = async (
    userId: string,
    session?: ClientSession,
  ): Promise<CartDocument | null> => {
    return await this.cartRepository.clear(userId, session);
  };

  private async resolvePriceAndStock(
    data: Pick<AddCartItemDto, "productId" | "variantId" | "sizeId">,
  ): Promise<ResolvedPriceStock> {
    const product = await this.productRepository.findById(data.productId);
    if (!product)
      throw new apiError(ERRORS.PRODUCT_NOT_FOUND, StatusCodes.NOT_FOUND);

    const strategy = this.getStrategy(product.productType as ProductType);
    return strategy.resolve(product, {
      variantId: data.variantId,
      sizeId: data.sizeId,
    });
  }

  private resolveSizePriceStock(
    sizes: ISize[],
    sizeId: string,
  ): ResolvedPriceStock {
    const size = sizes.find(
      (s: any) => s.id === sizeId || s._id?.toString() === sizeId,
    );
    if (!size) throw new apiError(ERRORS.INVALID_SIZE, StatusCodes.BAD_REQUEST);
    return { price: size.price, stock: size.stock };
  }

  private resolveVariantPriceStock(
    variants: IVariant[],
    variantId: string,
  ): ResolvedPriceStock {
    const variant = variants.find(
      (v: any) => v.id === variantId || v._id?.toString() === variantId,
    );
    if (!variant)
      throw new apiError(ERRORS.INVALID_VARIANT, StatusCodes.BAD_REQUEST);
    if (variant.price === undefined)
      throw new apiError(ERRORS.PRICE_NOT_AVAILABLE, StatusCodes.BAD_REQUEST);
    if (variant.stock === undefined)
      throw new apiError(ERRORS.STOCK_NOT_AVAILABLE, StatusCodes.BAD_REQUEST);
    return { price: variant.price, stock: variant.stock };
  }

  private resolveVariantSizePriceStock(
    variants: IVariant[],
    variantId: string,
    sizeId: string,
  ): ResolvedPriceStock {
    const variant = variants.find(
      (v: any) => v.id === variantId || v._id?.toString() === variantId,
    );
    if (!variant)
      throw new apiError(ERRORS.INVALID_VARIANT, StatusCodes.BAD_REQUEST);
    return this.resolveSizePriceStock(variant.sizes || [], sizeId);
  }

  private async recomputeTotals(
    cart: CartDocument,
    discountOverride?: number,
  ): Promise<void> {
    let discount = discountOverride ?? 0;
    if (cart.coupon && discountOverride === undefined) {
      const coupon = await this.couponService.validate(cart.coupon);
      discount = coupon.discount;
    }

    const subTotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const total = Math.max(0, subTotal - (subTotal * discount) / 100);
    cart.subTotal = subTotal;
    cart.total = total;
  }

  private findItem(
    cart: CartDocument,
    productId: string,
    variantId?: string,
    sizeId?: string,
  ) {
    return cart.items.find((item) =>
      this.isSameItem(item, productId, variantId, sizeId),
    );
  }

  private isSameItem(
    item: any,
    productId: string,
    variantId?: string,
    sizeId?: string,
  ) {
    const productMatch = item.product?.toString() === productId;
    const variantMatch =
      (item.variantId || "").toString() === (variantId || "");
    const sizeMatch = (item.sizeId || "").toString() === (sizeId || "");
    return productMatch && variantMatch && sizeMatch;
  }

  private async assertCartItemsValid(cart: CartDocument): Promise<void> {
    for (const item of cart.items) {
      const product = await this.productRepository.findById(
        item.product.toString(),
      );
      if (!product)
        throw new apiError(ERRORS.PRODUCT_NOT_FOUND, StatusCodes.NOT_FOUND);

      const strategy = this.getStrategy(product.productType as ProductType);
      strategy.validateItem(product, {
        variantId: item.variantId?.toString(),
        sizeId: item.sizeId?.toString(),
      });
    }
  }

  private async buildCartResponse(cart: CartDocument): Promise<CartView> {
    const items: CartItemView[] = [];
    const normalizeId = (value?: { toString?: () => string } | null) =>
      value?.toString?.() ?? undefined;

    for (const item of cart.items) {
      const product = await this.productRepository.findById(
        item.product.toString(),
      );
      if (!product)
        throw new apiError(ERRORS.PRODUCT_NOT_FOUND, StatusCodes.NOT_FOUND);

      const selection = {
        variantId: normalizeId(item.variantId),
        sizeId: normalizeId(item.sizeId),
      };

      const strategy = this.getStrategy(product.productType as ProductType);
      strategy.validateItem(product, selection);

      const { color, size, image } = this.resolveDisplayData(
        product,
        selection,
      );

      items.push({
        productId: item.product.toString(),
        variantId: selection.variantId,
        sizeId: selection.sizeId,
        title: product.title,
        image,
        color,
        size,
        quantity: item.quantity,
        price: item.price,
      });
    }

    return {
      id: cart._id.toString(),
      user: cart.user.toString(),
      items,
      coupon: cart.coupon ?? undefined,
      subTotal: cart.subTotal,
      total: cart.total,
    };
  }

  private resolveDisplayData(
    product: any,
    selection: CartSelection,
  ): { color?: string; size?: string; image?: string } {
    const firstImage = (images?: string[]) =>
      images && images.length ? images[0] : undefined;

    if (product.productType === "simple") {
      return { image: firstImage(product.images) };
    }

    if (product.productType === "sizes_only") {
      const size = (product.sizes || []).find(
        (s: any) =>
          s.id === selection.sizeId || s._id?.toString() === selection.sizeId,
      );
      return {
        size: size?.name,
        image: firstImage(product.images),
      };
    }

    if (product.productType === "variant") {
      const variant = (product.variants || []).find(
        (v: any) =>
          v.id === selection.variantId ||
          v._id?.toString() === selection.variantId,
      );
      return {
        color: variant?.color,
        image: firstImage(variant?.images) || firstImage(product.images),
      };
    }

    if (product.productType === "variant_with_sizes") {
      const variant = (product.variants || []).find(
        (v: any) =>
          v.id === selection.variantId ||
          v._id?.toString() === selection.variantId,
      );
      const size = (variant?.sizes || []).find(
        (s: any) =>
          s.id === selection.sizeId || s._id?.toString() === selection.sizeId,
      );
      return {
        color: variant?.color,
        size: size?.name,
        image: firstImage(variant?.images) || firstImage(product.images),
      };
    }

    return { image: firstImage(product.images) };
  }

  private getStrategy(productType: ProductType): ProductTypeStrategy {
    const strategies: Record<ProductType, ProductTypeStrategy> = {
      simple: {
        resolve: (product, selection) => {
          if (selection.variantId || selection.sizeId)
            throw new apiError(
              ERRORS.INVALID_PRODUCT_TYPE,
              StatusCodes.BAD_REQUEST,
            );
          if (product.price === undefined)
            throw new apiError(
              ERRORS.PRICE_NOT_AVAILABLE,
              StatusCodes.BAD_REQUEST,
            );
          if (product.stock === undefined)
            throw new apiError(
              ERRORS.STOCK_NOT_AVAILABLE,
              StatusCodes.BAD_REQUEST,
            );
          return { price: product.price, stock: product.stock };
        },
        validateItem: (product, selection) => {
          if (selection.variantId || selection.sizeId)
            throw new apiError(
              ERRORS.INVALID_PRODUCT_TYPE,
              StatusCodes.BAD_REQUEST,
            );
          if (product.price === undefined || product.stock === undefined)
            throw new apiError(
              ERRORS.PRICE_NOT_AVAILABLE,
              StatusCodes.BAD_REQUEST,
            );
        },
      },
      sizes_only: {
        resolve: (product, selection) => {
          if (selection.variantId || !selection.sizeId)
            throw new apiError(
              ERRORS.INVALID_PRODUCT_TYPE,
              StatusCodes.BAD_REQUEST,
            );
          return this.resolveSizePriceStock(
            product.sizes || [],
            selection.sizeId,
          );
        },
        validateItem: (product, selection) => {
          if (!selection.sizeId)
            throw new apiError(ERRORS.INVALID_SIZE, StatusCodes.BAD_REQUEST);
          this.resolveSizePriceStock(product.sizes || [], selection.sizeId);
        },
      },
      variant: {
        resolve: (product, selection) => {
          if (!selection.variantId || selection.sizeId)
            throw new apiError(
              ERRORS.INVALID_PRODUCT_TYPE,
              StatusCodes.BAD_REQUEST,
            );
          return this.resolveVariantPriceStock(
            product.variants || [],
            selection.variantId,
          );
        },
        validateItem: (product, selection) => {
          if (!selection.variantId)
            throw new apiError(ERRORS.INVALID_VARIANT, StatusCodes.BAD_REQUEST);
          this.resolveVariantPriceStock(
            product.variants || [],
            selection.variantId,
          );
        },
      },
      variant_with_sizes: {
        resolve: (product, selection) => {
          if (!selection.variantId || !selection.sizeId)
            throw new apiError(
              ERRORS.INVALID_PRODUCT_TYPE,
              StatusCodes.BAD_REQUEST,
            );
          return this.resolveVariantSizePriceStock(
            product.variants || [],
            selection.variantId,
            selection.sizeId,
          );
        },
        validateItem: (product, selection) => {
          if (!selection.variantId)
            throw new apiError(ERRORS.INVALID_VARIANT, StatusCodes.BAD_REQUEST);
          if (!selection.sizeId)
            throw new apiError(ERRORS.INVALID_SIZE, StatusCodes.BAD_REQUEST);
          this.resolveVariantSizePriceStock(
            product.variants || [],
            selection.variantId,
            selection.sizeId,
          );
        },
      },
    };

    const strategy = strategies[productType];
    if (!strategy)
      throw new apiError(ERRORS.INVALID_PRODUCT_TYPE, StatusCodes.BAD_REQUEST);
    return strategy;
  }
}
