import { IsEnum, IsOptional, IsUUID } from 'class-validator';

export enum SummaryLength {
  SHORt = 'short',
  MEDIUM = 'medium',
  DETAILED = 'detailed',
}

export class SummaryArticleDto {
  @IsUUID()
  articleId: string;
  @IsOptional()
  @IsEnum(SummaryLength)
  maxLength?: SummaryLength = SummaryLength.MEDIUM;
}
export interface SummarizeArticleResponse {
  articleId: string;
  summary: string;
  originalLength: number;
  summaryLength: number;
}
