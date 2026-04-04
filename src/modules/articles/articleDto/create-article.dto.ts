import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
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
  tags: string[]; // array of tag names
}
