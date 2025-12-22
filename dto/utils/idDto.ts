import { Expose } from "class-transformer";
import { IsMongoId, IsString } from "class-validator";
import { Types } from "mongoose";

export class idParamDto {
  @Expose()
  @IsMongoId()
  @IsString()
  id!: Types.ObjectId;
}
