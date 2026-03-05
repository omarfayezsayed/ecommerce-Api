import { userDocumnet, Iuser } from "../../models/user";

export interface UserRepository {
  findAll(queryObj?: any): Promise<Array<userDocumnet>>;
  findOnebyEmail(email: string): Promise<userDocumnet | null>;
  findOneById(id: string): Promise<userDocumnet | null>;
  deleteOne(id: string): Promise<any>;
  createOne(data: Partial<Iuser>): Promise<userDocumnet>;
  updateOne(id: string, data: Partial<Iuser>): Promise<userDocumnet | null>;
}
