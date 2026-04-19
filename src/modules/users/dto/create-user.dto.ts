import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from '@prisma/client';
export class CreateUserDto {
  @IsString()
  @MinLength(3, { message: 'Login must be at least 3 characters' })
  login: string;

  @IsString()
  @MinLength(3, { message: 'Password must be at least 3 characters' })
  @MaxLength(30, { message: 'Password must be at least 30 characters' })
  password: string;

  @IsOptional()
  @IsEnum(Role, { message: 'Role will be admin, editor, viewer' })
  role?: Role;
}
