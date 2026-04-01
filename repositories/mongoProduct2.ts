import { Icategory } from "../models/category";
import { IsubCategory } from "../models/subCategory";
import { ClientSession, Types } from "mongoose";
import {
  populatedProduct2,
  Product2,
  product2Document,
} from "../models/product2";
import {
  ICreateProduct,
  IUpdateProduct,
  ICreateVariant,
  ICreateSize,
} from "../models/product2";
import { Ibrand } from "../models/brand";

export class MongoProductRepository {
  private buildUpdateFields(
    prefix: string,
    data: Record<string, any>,
  ): Record<string, any> {
    return Object.keys(data).reduce(
      (acc, key) => {
        acc[`${prefix}${key}`] = (data as any)[key];
        return acc;
      },
      {} as Record<string, any>,
    );
  }

  async findAll(): Promise<product2Document[]> {
    return await Product2.find();
  }

  async findById(id: string): Promise<product2Document | null> {
    return await Product2.findById(id);
  }
  async create(data: ICreateProduct): Promise<product2Document> {
    return await Product2.create(data);
  }
  async update(
    id: string,
    data: IUpdateProduct,
  ): Promise<product2Document | null> {
    return await Product2.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }
  async delete(id: string): Promise<product2Document | null> {
    return await Product2.findByIdAndDelete(id);
  }

  //   addImages for simple and sizes_only products
  async addImages(
    productId: string,
    imageBlobNames: string[],
  ): Promise<product2Document | null> {
    return await Product2.findByIdAndUpdate(
      productId,
      {
        $addToSet: { images: { $each: imageBlobNames } },
      },
      { runValidators: true, new: true },
    );
  }
  async addVariantImages(
    productId: string,
    variantId: string,
    imageBlobNames: string[],
  ): Promise<product2Document | null> {
    return await Product2.findOneAndUpdate(
      { _id: productId, "variants._id": variantId },
      {
        $addToSet: { "variants.$.images": { $each: imageBlobNames } },
      },
      { runValidators: true, new: true },
    );
  }
  //   sizes only and variants products have sizes, this function can be used for both by checking the product type in service layer
  async addSizeToProduct(
    productId: string,
    data: ICreateSize,
  ): Promise<product2Document | null> {
    return Product2.findByIdAndUpdate(
      productId,
      { $push: { sizes: data } },
      { new: true, runValidators: true },
    );
  }

  async updateProductSize(
    productId: string,
    sizeId: string,
    data: Partial<ICreateSize>,
  ): Promise<product2Document | null> {
    const prefixed = this.buildUpdateFields(
      "sizes.$.",
      data as Record<string, any>,
    );
    return await Product2.findOneAndUpdate(
      { _id: productId, "sizes._id": sizeId },
      { $set: prefixed },
      { new: true, runValidators: true },
    );
  }

  async deleteProductSize(
    productId: string,
    sizeId: string,
  ): Promise<product2Document | null> {
    return await Product2.findByIdAndUpdate(
      productId,
      { $pull: { sizes: { _id: sizeId } } },
      { new: true },
    );
  }
  async addVariant(
    productId: string,
    data: ICreateVariant,
  ): Promise<product2Document | null> {
    return await Product2.findByIdAndUpdate(
      productId,
      { $push: { variants: data } },
      { new: true, runValidators: true },
    );
  }
  async updateVariant(
    productId: string,
    variantId: string,
    data: Partial<ICreateVariant>,
  ): Promise<product2Document | null> {
    const prefixed = this.buildUpdateFields(
      "variants.$.",
      data as Record<string, any>,
    );
    const product = await Product2.findOneAndUpdate(
      { _id: productId, "variants._id": variantId },
      { $set: prefixed },
      { new: true, runValidators: true },
    );
    console.log(product);
    return product;
  }

  async deleteVariant(
    productId: string,
    variantId: string,
  ): Promise<product2Document | null> {
    return await Product2.findByIdAndUpdate(
      productId,
      { $pull: { variants: { _id: variantId } } },
      { new: true },
    );
  }
  async addVariantSize(
    productId: string,
    variantId: string,
    data: ICreateSize,
  ): Promise<product2Document | null> {
    return await Product2.findOneAndUpdate(
      { _id: productId, "variants._id": variantId },
      { $push: { "variants.$.sizes": data } },
      { new: true, runValidators: true },
    );
  }

  async updateVariantSize(
    productId: string,
    variantId: string,
    sizeId: string,
    data: Partial<ICreateSize>,
  ): Promise<product2Document | null> {
    const prefixed = this.buildUpdateFields(
      "variants.$[variant].sizes.$[size].",
      data as Record<string, any>,
    );
    return await Product2.findByIdAndUpdate(
      productId,
      { $set: prefixed },
      {
        new: true,
        runValidators: true,
        arrayFilters: [{ "variant._id": variantId }, { "size._id": sizeId }],
      },
    );
  }

  async deleteVariantSize(
    productId: string,
    variantId: string,
    sizeId: string,
  ): Promise<product2Document | null> {
    return await Product2.findOneAndUpdate(
      { _id: productId, "variants._id": variantId },
      { $pull: { "variants.$.sizes": { _id: sizeId } } },
      { new: true },
    );
  }

  async decrementStockAtomic(
    productId: string,
    quantity: number,
    variantId?: string,
    sizeId?: string,
    session?: ClientSession,
  ): Promise<boolean> {
    const id = new Types.ObjectId(productId);

    if (variantId && sizeId) {
      const result = await Product2.updateOne(
        { _id: id, productType: "variant_with_sizes" },
        {
          $inc: {
            "variants.$[v].sizes.$[s].stock": -quantity,
            sold: quantity,
          },
        },
        {
          session,
          arrayFilters: [
            { "v._id": new Types.ObjectId(variantId) },
            {
              "s._id": new Types.ObjectId(sizeId),
              "s.stock": { $gte: quantity },
            },
          ],
        },
      );
      return result.modifiedCount > 0;
    }

    if (variantId) {
      const result = await Product2.updateOne(
        {
          _id: id,
          productType: "variant",
          "variants._id": new Types.ObjectId(variantId),
          "variants.stock": { $gte: quantity },
        },
        { $inc: { "variants.$.stock": -quantity, sold: quantity } },
        { session },
      );
      return result.modifiedCount > 0;
    }

    if (sizeId) {
      const result = await Product2.updateOne(
        {
          _id: id,
          productType: "sizes_only",
          "sizes._id": new Types.ObjectId(sizeId),
          "sizes.stock": { $gte: quantity },
        },
        { $inc: { "sizes.$.stock": -quantity, sold: quantity } },
        { session },
      );
      return result.modifiedCount > 0;
    }

    const result = await Product2.updateOne(
      { _id: id, productType: "simple", stock: { $gte: quantity } },
      { $inc: { stock: -quantity, sold: quantity } },
      { session },
    );
    return result.modifiedCount > 0;
  }

  async incrementStockAtomic(
    productId: string,
    quantity: number,
    variantId?: string,
    sizeId?: string,
    session?: ClientSession,
  ): Promise<boolean> {
    const id = new Types.ObjectId(productId);

    if (variantId && sizeId) {
      const result = await Product2.updateOne(
        { _id: id, productType: "variant_with_sizes" },
        {
          $inc: {
            "variants.$[v].sizes.$[s].stock": quantity,
            sold: -quantity,
          },
        },
        {
          session,
          arrayFilters: [
            { "v._id": new Types.ObjectId(variantId) },
            { "s._id": new Types.ObjectId(sizeId) },
          ],
        },
      );
      return result.modifiedCount > 0;
    }

    if (variantId) {
      const result = await Product2.updateOne(
        {
          _id: id,
          productType: "variant",
          "variants._id": new Types.ObjectId(variantId),
        },
        { $inc: { "variants.$.stock": quantity, sold: -quantity } },
        { session },
      );
      return result.modifiedCount > 0;
    }

    if (sizeId) {
      const result = await Product2.updateOne(
        {
          _id: id,
          productType: "sizes_only",
          "sizes._id": new Types.ObjectId(sizeId),
        },
        { $inc: { "sizes.$.stock": quantity, sold: -quantity } },
        { session },
      );
      return result.modifiedCount > 0;
    }

    const result = await Product2.updateOne(
      { _id: id, productType: "simple" },
      { $inc: { stock: quantity, sold: -quantity } },
      { session },
    );
    return result.modifiedCount > 0;
  }
}
