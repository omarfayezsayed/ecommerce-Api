// services/address.service.ts
import { StatusCodes } from "http-status-codes";
import { apiError } from "../utils/apiError";
import { UserRepository } from "../repositories/interfaces/user";
import { CreateAddressDto } from "../dto//addressDto/addressRequestDto";
import { UpdateAddressDto } from "../dto//addressDto/addressRequestDto";

export class AddressService {
  constructor(private readonly userRepository: UserRepository) {}

  // get all addresses
  public getAll = async (userId: string) => {
    return await this.userRepository.getAddresses(userId);
  };

  // get single address
  public getById = async (userId: string, addressId: string) => {
    const address = await this.userRepository.findAddressById(
      userId,
      addressId,
    );
    if (!address)
      throw new apiError("Address not found", StatusCodes.NOT_FOUND);
    return address;
  };

  // add new address
  public add = async (userId: string, data: CreateAddressDto) => {
    // if this is first address — make it default automatically
    // const addresses = await this.userRepository.getAddresses(userId);

    const addresses = await this.userRepository.addAddress(userId, data);

    return addresses;
  };

  // update address
  public update = async (
    userId: string,
    addressId: string,
    data: UpdateAddressDto,
  ) => {
    // check address exists and belongs to user
    const address = await this.userRepository.findAddressById(
      userId,
      addressId,
    );
    if (!address)
      throw new apiError("Address not found", StatusCodes.NOT_FOUND);

    const updateAddress = await this.userRepository.updateAddress(
      userId,
      addressId,
      data,
    );
    return updateAddress;
  };

  // delete address
  public remove = async (userId: string, addressId: string) => {
    // check address exists
    const address = await this.userRepository.findAddressById(
      userId,
      addressId,
    );
    if (!address)
      throw new apiError("Address not found", StatusCodes.NOT_FOUND);

    return await this.userRepository.removeAddress(userId, addressId);
  };
}
