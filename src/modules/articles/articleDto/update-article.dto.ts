import { IsArray, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ArticleStatus } from '../../../core/types/articleStatus';
import { Status } from '@prisma/client';
export class UpdateArticleDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  content: string;

  @IsEnum(Status)
  @IsOptional()
  status: Status;

  @IsUUID()
  @IsOptional()
  authorId?: string; // refers to User

  @IsUUID()
  @IsOptional()
  categoryId?: string; // refers to Category

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags: string[]; // array of tag names
}
