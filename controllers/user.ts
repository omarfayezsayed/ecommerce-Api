import { StatusCodes } from "http-status-codes";
import { asyncWrapper } from "../utils/asyncWrapper";
import { Request, Response } from "express";
import { UserService } from "../services/user";
import { queryParser } from "../utils/queryParser";
import { UserInternalDto } from "../dto/userDto./userInternalDto";
export class UserController {
  private userService: UserService;
  constructor(userService: UserService) {
    this.userService = userService;
  }
  public findAllUsers = asyncWrapper(async (req: Request, res: Response) => {
    const parsedQuery = queryParser(req.query);
    const users = await this.userService.findAll(parsedQuery);
    // const resusers = users.map((user) => touserResponseDto(user));
    res.status(StatusCodes.OK).json({
      status: "success",
      records: users.length,
      data: users,
    });
  });

  public createUser = asyncWrapper(async (req: Request, res: Response) => {
    const userData: UserInternalDto = req.body;
    console.log(req.body, "here");
    userData.file = req.file;
    const user = await this.userService.createOne(userData);
    res.status(StatusCodes.CREATED).json({
      status: "success",
      data: user,
    });
  });

  public getUser = asyncWrapper(async (req: Request, res: Response) => {
    const user = await this.userService.getOne(req.params.id);
    res.status(StatusCodes.OK).json({
      staus: "success",
      data: user,
    });
  });

  public deleteUser = asyncWrapper(async (req: Request, res: Response) => {
    await this.userService.deleteOne(req.params.id);

    res.status(StatusCodes.NO_CONTENT).json({
      status: "success",
    });
  });

  public updateUser = asyncWrapper(async (req: Request, res: Response) => {
    const userData: UserInternalDto = req.body;
    userData.file = req.file;
    const user = await this.userService.updateOne(req.params.id, userData);
    res.status(StatusCodes.OK).json({
      status: "success",
      data: user,
    });
  });
}
