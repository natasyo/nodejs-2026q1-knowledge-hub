import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  name: string;
  @IsString()
  @IsOptional()
  description: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;
  @IsOptional()
  @IsUUID()
  authorId?: string;
}
