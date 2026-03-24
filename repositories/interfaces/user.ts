import { addressDocument, IAddress } from "../../models/address";
import { Iproduct, productDocumnet } from "../../models/product";
import { userDocumnet, Iuser } from "../../models/user";

export interface UserRepository {
  findAll(queryObj?: any): Promise<Array<userDocumnet>>;
  findOnebyEmail(email: string): Promise<userDocumnet | null>;
  findOnebyResetCode(email: string): Promise<userDocumnet | null>;
  findOneByVerficationCode(code: string): Promise<userDocumnet | null>;
  findOneById(id: string): Promise<userDocumnet | null>;
  deleteOne(id: string): Promise<any>;
  createOne(data: Partial<Iuser>): Promise<userDocumnet>;
  updateOne(id: string, data: Partial<Iuser>): Promise<userDocumnet | null>;

  // wishList
  addToWishlist(userId: string, productId: string): Promise<void>;
  getWishlist(userId: string): Promise<Array<productDocumnet>>;
  clearWishlist(userId: string): Promise<void>;
  removeFromWishlist(userId: string, productId: string): Promise<void>;
  isInWishlist(userId: string, productId: string): Promise<boolean>;

  // address
  getAddresses(userId: string): Promise<Array<addressDocument> | null>;
  findAddressById(
    userId: string,
    addressId: string,
  ): Promise<addressDocument | null>;
  addAddress(
    userId: string,
    data: Omit<IAddress, "id">,
  ): Promise<addressDocument[] | null>;
  updateAddress(
    userId: string,
    addressId: string,
    data: Partial<IAddress>,
  ): Promise<addressDocument | null>;

  removeAddress(userId: string, addressId: string): Promise<void>;
}
