import { Icategory } from "../models/category";
import { IsubCategory } from "../models/subCategory";
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
    return await Product2.findOneAndUpdate(
      { _id: productId, "sizes._id": sizeId },
      { $set: data },
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
  async addVariant(productId: string, data: ICreateVariant) {
    return Product2.findByIdAndUpdate(
      productId,
      { $push: { variants: data } },
      { new: true, runValidators: true },
    );
  }
  async updateVariant(
    productId: string,
    variantId: string,
    data: Partial<ICreateVariant>,
  ) {
    return Product2.findOneAndUpdate(
      { _id: productId, "variants._id": variantId },
      { $set: data },
      { new: true, runValidators: true },
    );
  }

  async deleteVariant(productId: string, variantId: string) {
    return Product2.findByIdAndUpdate(
      productId,
      { $pull: { variants: { _id: variantId } } },
      { new: true },
    );
  }
}
