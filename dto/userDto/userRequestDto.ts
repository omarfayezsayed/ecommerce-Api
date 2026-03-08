import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from "class-validator";
import { Expose } from "class-transformer";
import { UserRole } from "../../utils/userRoles";
export class registerUserDto {
  @Expose()
  @IsString()
  @Length(3, 20)
  name!: string;

  @Expose()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  slug!: string;

  @Expose()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  profileImage!: string;

  @Expose()
  @IsEmail()
  email!: string;

  @Expose()
  @IsString()
  @Length(5, 15)
  password!: string;

  @Expose()
  @IsOptional()
  @IsPhoneNumber("EG")
  phone?: string;

  @Expose()
  @IsString()
  role!: UserRole;
}

export class updateUserDto {
  @Expose()
  @IsString()
  @Length(3, 20)
  @IsOptional()
  name!: string;

  @Expose()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  slug!: string;

  @Expose()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  profileImage!: string;

  @Expose()
  @IsEmail()
  @IsOptional()
  email!: string;

  @Expose()
  @IsString()
  @Length(5, 15)
  @IsOptional()
  password!: string;

  @Expose()
  @IsOptional()
  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @Expose()
  @IsString()
  @IsOptional()
  role!: UserRole;
}
