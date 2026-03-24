// controllers/address.controller.ts
import { Request, Response } from "express";
import { asyncWrapper } from "../utils/asyncWrapper";
import { AddressService } from "../services/address";
import { StatusCodes } from "http-status-codes";

export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  public getAll = asyncWrapper(async (req: Request, res: Response) => {
    const addresses = await this.addressService.getAll(req.user!.id);
    res.status(StatusCodes.OK).json({
      status: "success",
      records: addresses?.length ?? 0,
      data: addresses,
    });
  });

  public getById = asyncWrapper(async (req: Request, res: Response) => {
    const address = await this.addressService.getById(
      req.user!.id,
      req.params.id,
    );
    res.status(StatusCodes.OK).json({
      status: "success",
      datt: address,
    });
  });

  public add = asyncWrapper(async (req: Request, res: Response) => {
    const addresses = await this.addressService.add(req.user!.id, req.body);
    res.status(201).json({
      status: "success",
      data: addresses,
    });
  });

  public update = asyncWrapper(async (req: Request, res: Response) => {
    const address = await this.addressService.update(
      req.user!.id,
      req.params.id,
      req.body,
    );
    res.status(StatusCodes.OK).json({
      status: "success",
      data: address,
    });
  });

  public remove = asyncWrapper(async (req: Request, res: Response) => {
    await this.addressService.remove(req.user!.id, req.params.id);
    res.status(StatusCodes.NO_CONTENT).json();
  });

  //   public setDefault = asyncWrapper(async (req: Request, res: Response) => {
  //     const addresses = await this.addressService.setDefault(
  //       req.user!.id,
  //       req.params.id,
  //     );
  //     res.json(addresses);
  //   });
}
