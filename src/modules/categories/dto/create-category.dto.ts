import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;
  @IsString()
  description: string;
  // Если категория МОЖЕТ отсутствовать:
  @IsOptional()
  @IsUUID()
  categoryId?: string;
  @IsOptional()
  @IsUUID()
  authorId?: string;
}
