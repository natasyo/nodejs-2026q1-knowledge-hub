import { IsEnum, IsOptional } from 'class-validator';
import { Order } from '../../dto/sort-order.dto';

export class ArticleQueryDto {
  @IsEnum(Order)
  @IsOptional()
  order?: Order;

  @IsOptional()
  sortBy?: string;

  @IsOptional()
  status?: string;
  @IsOptional()
  tag?: string;
  @IsOptional()
  categoryId?: string;
}
