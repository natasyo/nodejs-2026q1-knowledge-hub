import { IsArray, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ArticleStatus } from '../../../core/types/articleStatus';
export class UpdateArticleDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  content: string;

  @IsEnum(ArticleStatus)
  @IsOptional()
  status: ArticleStatus;

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
