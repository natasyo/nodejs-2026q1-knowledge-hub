import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Order } from '../../dto/sort-order.dto';

export class QueryComments {
  @IsEnum(Order)
  @IsOptional()
  order?: Order;

  @IsOptional()
  sortBy?: string;

  @IsString()
  articleId: string;
}
