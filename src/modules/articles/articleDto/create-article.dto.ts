import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ArticleStatus } from '../../../core/types/articleStatus';

export class CreateArticleDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsEnum(ArticleStatus)
  status: ArticleStatus;

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
