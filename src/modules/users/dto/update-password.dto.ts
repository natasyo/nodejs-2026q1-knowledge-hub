import { IsString, MaxLength, MinLength } from 'class-validator';
import { Match } from '../../../core/decorators/match.decorator';

export class UpdatePasswordDto {
  @IsString()
  @MinLength(3, { message: 'Password must be at least 3 characters' })
  @MaxLength(30, { message: 'Password must be at least 30 characters' })
  oldPassword: string;
  @IsString()
  @MinLength(3, { message: 'Password must be at least 3 characters' })
  @MaxLength(30, { message: 'Password must be at least 30 characters' })
  // @Match('oldPassword')
  newPassword: string;
}
