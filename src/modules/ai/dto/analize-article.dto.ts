import { IsEnum } from 'class-validator';

export enum Task {
  REVIEW = 'review',
  BUGS = 'bugs',
  OPTIMIZE = 'optimize',
  EXPLAIN = 'explain',
}
export class AnalyzeArticleRequestDto {
  @IsEnum(Task)
  task?: Task; // optional, defaults to 'review'
}

export interface AnalyzeArticleResponse {
  articleId: string;
  analysis: string;
  suggestions: string[];
  severity: 'info' | 'warning' | 'error';
}
