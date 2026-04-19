import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Status } from '@prisma/client';

export class CreateArticleDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsEnum(Status)
  status: Status;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags: string[]; // array of tag names

  @IsUUID()
  @IsOptional()
  authorId?: string; // если автор задан

  @IsUUID()
  @IsOptional()
  categoryId?: string;
}
