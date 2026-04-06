import { IsEnum, IsOptional } from 'class-validator';

export enum Order {
  ASC = 'asc',
  DESC = 'desc',
}

export class SortOrderDto {
  @IsEnum(Order)
  @IsOptional()
  order?: Order;

  @IsOptional()
  sortBy?: string;
}
