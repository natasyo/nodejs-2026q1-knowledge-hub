import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
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
}
