import { IsArray, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ArticleStatus } from '../../../core/types/articleStatus';
export class UpdateArticleDto {
  @IsString()
  title: string;
  @IsString()
  content: string;

  @IsEnum(ArticleStatus)
  status: ArticleStatus;
  @IsUUID()
  @IsOptional()
  authorId?: string; // refers to User
  @IsUUID()
  @IsOptional()
  categoryId?: string; // refers to Category

  @IsArray()
  @IsString({ each: true })
  tags: string[]; // array of tag names
}
