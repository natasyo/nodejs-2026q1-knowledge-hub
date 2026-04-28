import { IsOptional } from 'class-validator';

export class GetArticlesQueryDto {
  @IsOptional()
  status?: string;

  @IsOptional()
  tag?: string;

  @IsOptional()
  categoryId?: string;
}
