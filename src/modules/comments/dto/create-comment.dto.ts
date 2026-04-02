import { IsString, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  content: string;
  @IsUUID()
  articleId: string; // refers to Article
  @IsUUID()
  authorId: string | null; // refers to User
}
