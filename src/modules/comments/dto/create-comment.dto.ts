import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  content: string;
  @IsUUID()
  articleId: string; // refers to Article
  @IsUUID()
  @IsOptional()
  authorId: string; // refers to User
}
