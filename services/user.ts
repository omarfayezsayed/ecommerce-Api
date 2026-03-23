import slugify from "slugify";
import { userDocumnet, Iuser, User } from "../models/user";
import bcrypt from "bcryptjs";

import { apiError } from "../utils/apiError";
import { StatusCodes } from "http-status-codes";
import { StorageFolder } from "../utils/storageFolder";
import { ImageService } from "./imageService";
import { UserRepository } from "../repositories/interfaces/user";
import { UserInternalDto } from "../dto/userDto/userInternalDto";
import { IAuthUser } from "./interfaces/iAuthUser";
import { IReviewProductService } from "./interfaces/product";
import { IReviewUserService } from "./interfaces/user";

export class UserService implements IAuthUser, IReviewUserService {
  private repository: UserRepository;
  private imageService: ImageService;

  constructor(repo: UserRepository, imageService: ImageService) {
    this.repository = repo;
    this.imageService = imageService;
  }
  async exists(userId: string): Promise<boolean> {
    const user = await this.findById(userId);
    return !!user;
  }
  async getMe(userId: string) {
    const user = await this.findById(userId);
    if (!user) {
      throw new apiError("no user with that id", StatusCodes.NOT_FOUND);
    }
    return {
      name: user.name!,
      phone: user.phone!,
      email: user.email!,
      isverified: user.isVerfied,
      profileImage: user.profileImage,
    };
  }
  async updateMe(
    userId: string,
    data: { name: string | undefined; phone: string | undefined },
  ) {
    await this.updateOne(userId, data);
  }
  async findbyResetCode(code: string): Promise<userDocumnet | null> {
    const user = await this.repository.findOnebyResetCode(code);
    return user;
  }
  async resetPassword(userId: string, password: string): Promise<void> {
    await this.updateOne(userId, { password });
  }
  async changePassword(
    userId: string,
    newPassword: string,
    oldPassword: string,
  ) {
    const user = await this.repository.findOneById(userId);
    if (!user)
      throw new apiError("no user with that id", StatusCodes.NOT_FOUND);
    if (user.authProvider === "google") {
      throw new apiError("can't change your password", StatusCodes.BAD_REQUEST);
    }
    const valid = bcrypt.compare(oldPassword, user.password!);
    if (!valid) {
      throw new apiError(
        "wrong password please try again",
        StatusCodes.BAD_REQUEST,
      );
    }
    await this.updateOne(userId, {
      password: newPassword,
      passwordChangedAt: new Date(),
    });
  }
  async uploadProfileImage(userId: string, file: Express.Multer.File) {
    if (!file) {
      throw new apiError("Must provide an image", StatusCodes.BAD_REQUEST);
    }
    await this.updateOne(userId, { file });
  }

  async findByVerificationCode(code: string): Promise<userDocumnet | null> {
    const user = await this.repository.findOneByVerficationCode(code);
    return user;
  }
  async findByResetCode(code: string): Promise<userDocumnet | null> {
    const user = await this.repository.findOnebyResetCode(code);
    return user;
  }
  async markAsVerified(userId: string): Promise<void> {
    await this.updateOne(userId, { isVerfied: true });
  }

  public findByEmail = async (email: string): Promise<userDocumnet | null> => {
    const user = await this.findOneByEmail(email);
    return user;
  };
  public async findById(id: string): Promise<Partial<Iuser> | null> {
    const user = await this.getOne(id);
    return user;
  }
  createLocalUser(data: UserInternalDto): Promise<userDocumnet> {
    data.authProvider = "local";
    return this.createOne(data);
  }
  createGoogleUser(data: UserInternalDto): Promise<userDocumnet> {
    data.authProvider = "google";
    return this.createOne(data);
  }
  async updateRefreshToken(
    id: string,
    refreshToken: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.updateOne(id, {
      refreshToken,
      refreshTokenExpiresAt: expiresAt,
    });
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
    // console.log("password", data.password);
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
      passwordChangedAt: data.passwordChangedAt,
      phone: data.phone,
      isVerfied: data.isVerfied,
      role: data.role,
      blobName: data.blobName,
      refreshToken: data.refreshToken,
      refreshTokenExpiresAt: data.refreshTokenExpiresAt,
      authProvider: data.authProvider,
    };
  }
}
