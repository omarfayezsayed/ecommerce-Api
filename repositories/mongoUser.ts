import { addressDocument, IAddress } from "../models/address";
import { productDocumnet } from "../models/product";
import { Iuser, User, userDocumnet } from "../models/user";
import { queryBuilder } from "../utils/queryBuilder";
import { UserRepository } from "./interfaces/user";

export class MongoUserRepository implements UserRepository {
  async findOnebyResetCode(
    resetPasswordCode: string,
  ): Promise<userDocumnet | null> {
    const user = await User.findOne({ resetPasswordCode });
    return user;
  }
  async findOneByVerficationCode(code: string): Promise<userDocumnet | null> {
    const user = await User.findOne({ verificationCode: code });
    return user;
  }
  async findAll(queryObj?: any): Promise<Array<userDocumnet>> {
    const query = new queryBuilder(User.find(), queryObj)
      .sort()
      .fieldlimits()
      .pagination()
      .filter()
      .build();
    return await query;
  }
  async findOnebyEmail(email: string): Promise<userDocumnet | null> {
    const user = await User.findOne({ email });
    return user;
  }
  async findOneById(id: string): Promise<userDocumnet | null> {
    const user = await User.findById(id);
    return user;
  }
  async deleteOne(id: string): Promise<any> {
    const user = await User.findByIdAndDelete(id);
    return user;
  }
  async createOne(data: Partial<Iuser>): Promise<userDocumnet> {
    const user = await User.create(data);

    return user;
  }
  async updateOne(
    id: string,
    data: Partial<Iuser>,
  ): Promise<userDocumnet | null> {
    const user = await User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    return user;
  }

  async addToWishlist(userId: string, productId: string) {
    // console.log(userId, wproductId);
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { wishList: productId } }, // addToSet prevents duplicates
      { new: true },
    );
  }
  async getWishlist(userId: string) {
    const wishList = (await User.findById(userId)
      .select("wishList") // only return wishlist field
      .populate("wishList")) as Array<productDocumnet>; // populate product details

    return wishList;
  }
  async removeFromWishlist(userId: string, productId: string) {
    await User.findByIdAndUpdate(
      userId,
      { $pull: { wishList: productId } },
      { new: true },
    );
  }
  async clearWishlist(userId: string) {
    await User.findByIdAndUpdate(userId, { $set: { wishList: [] } });
  }
  async isInWishlist(userId: string, productId: string): Promise<boolean> {
    const user = await User.findOne({
      _id: userId,
      wishList: productId,
    });
    return !!user;
  }

  // addresses
  async getAddresses(userId: string): Promise<Array<addressDocument> | null> {
    const user = await User.findById(userId).select("addresses");
    return user?.addresses ?? [];
  }
  // get single address by id
  async findAddressById(
    userId: string,
    addressId: string,
  ): Promise<addressDocument | null> {
    const user = await User.findOne({
      _id: userId,
      "addresses._id": addressId, // find user that has this address
    });
    console.log("addresses", user?.addresses[0].id);
    const targetAdress = user?.addresses.filter(
      (address) => address.id === addressId,
    );
    return targetAdress ? targetAdress[0] : null;
  }

  // add new address
  async addAddress(
    userId: string,
    data: Omit<IAddress, "id">,
  ): Promise<addressDocument[] | null> {
    const user = (await User.findByIdAndUpdate(
      userId,
      { $push: { addresses: data } }, // push new address to array
      { new: true, runValidators: true },
    ).select("addresses -_id")) as unknown as {
      addresses: [addressDocument];
    } | null;

    return user?.addresses ?? null;
  }
  async updateAddress(
    userId: string,
    addressId: string,
    data: Partial<IAddress>,
  ) {
    const updateFields = Object.keys(data).reduce((acc, key) => {
      acc[`addresses.$.${key}`] = (data as any)[key]; // addresses.$.city, addresses.$.street etc
      return acc;
    }, {} as any);
    const { addresses } = (await User.findOneAndUpdate(
      { _id: userId, "addresses._id": addressId }, // find user + address
      { $set: updateFields }, // update only provided fields
      { new: true, runValidators: true },
    ).select("addresses -_id")) as { addresses: addressDocument[] };
    const targetAdress = addresses?.filter(
      (address) => address.id === addressId,
    );
    console.log("target", targetAdress);
    return targetAdress ? targetAdress[0] : null;
  }
  // delete specific address by id
  async removeAddress(userId: string, addressId: string) {
    await User.findByIdAndUpdate(
      userId,
      { $pull: { addresses: { _id: addressId } } }, // remove address with this id
      { new: true },
    );
  }
}
