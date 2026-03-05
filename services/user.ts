import slugify from "slugify";
import { userDocumnet, Iuser, User } from "../models/user";
import bcrypt from "bcryptjs";

import { apiError } from "../utils/apiError";
import { StatusCodes } from "http-status-codes";
import { StorageFolder } from "../utils/storageFolder";
import { ImageService } from "./imageService";
import { UserRepository } from "../repositories/interfaces/user";
import { UserInternalDto } from "../dto/userDto./userInternalDto";
export class UserService {
  private repository: UserRepository;
  private imageService: ImageService;

  constructor(repo: UserRepository, imageService: ImageService) {
    this.repository = repo;
    this.imageService = imageService;
  }
  public existsById = async (id: string): Promise<boolean> => {
    const exists = await this.repository.findOneById(id);
    return !!exists;
  };
  public createOne = async (data: UserInternalDto): Promise<userDocumnet> => {
    console.log(data, "data");
    data.slug = slugify(data.name!);
    if (data.file) {
      const uploadedImage = await this.imageService.uploadFromDto(
        data.file,
        StorageFolder.USERS,
      );
      data.blobName = uploadedImage.blobName;
      data.profileImage = uploadedImage.imageUrl;
    }
    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      data.password = hashedPassword;
    }
    const user = await this.repository.createOne(this.mapToIUsero(data));
    return user;
  };
  public findOneByEmail = async (email: string) => {
    const user = await this.repository.findOnebyEmail(email);
    return user;
  };
  public getOne = async (id: string) => {
    const brand = await this.repository.findOneById(id);
    if (!brand) {
      throw new apiError(`no user with that id:${id}`, StatusCodes.NOT_FOUND);
    }
    return brand;
  };
  updateOne = async (id: string, data: UserInternalDto) => {
    let blobName: string | undefined = "";
    if (data.file) {
      const uploadedImage = await this.imageService.uploadFromDto(
        data.file,
        StorageFolder.USERS,
      );
      data.blobName = uploadedImage.blobName;
      data.profileImage = uploadedImage.imageUrl;
    }

    if (data.name) {
      data.slug = slugify(data.name);
    }
    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      data.password = hashedPassword;
    }
    const userData = this.mapToIUsero(data);
    Object.keys(userData).forEach(
      (key) =>
        (userData as any)[key] === undefined && delete (userData as any)[key],
    );

    const user = await this.repository.updateOne(id, userData);
    if (!user) {
      if (blobName?.length) {
        await this.imageService.deleteByBlobName(blobName);
      }
      throw new apiError(`no brand with that id:${id}`, StatusCodes.NOT_FOUND);
    }
    return user;
  };
  public deleteOne = async (id: string) => {
    const user = await this.repository.deleteOne(id);
    if (!user) {
      throw new apiError(`no user with that id :${id}`, StatusCodes.NOT_FOUND);
    }
    return user;
  };

  public findAll = async (queryObj?: any) => {
    const users = await this.repository.findAll(queryObj);
    return users;
  };

  private mapToIUsero(data: UserInternalDto): Partial<Iuser> {
    return {
      name: data.name,
      slug: data.slug,
      profileImage: data.profileImage,
      email: data.email,
      googleId: data.googleId,
      password: data.password,
      phone: data.phone,
      isVerfied: data.isVerfied,
      role: data.role,
      blobName: data.blobName,
    };
  }
}
