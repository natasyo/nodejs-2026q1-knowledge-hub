import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { ArticleStatus } from '../../../core/types/articleStatus';
import { Optional } from '@nestjs/common';
export class UpdateArticleDto {
  @IsString()
  title: string;
  @IsString()
  content: string;

  @IsEnum(ArticleStatus)
  status: ArticleStatus;
  @IsString()
  @Optional()
  authorId: string | null; // refers to User
  @Optional()
  categoryId: string | null; // refers to Category

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[]; // array of tag names
}
