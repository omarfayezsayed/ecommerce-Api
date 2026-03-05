import { Iuser, User, userDocumnet } from "../models/user";
import { queryBuilder } from "../utils/queryBuilder";
import { UserRepository } from "./interfaces/user";

export class MongoUserRepository implements UserRepository {
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
}
