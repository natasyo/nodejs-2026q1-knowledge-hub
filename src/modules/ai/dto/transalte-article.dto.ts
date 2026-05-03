import { IsOptional, IsString } from 'class-validator';

export class TranslateArticleDto {
  @IsString()
  targetLanguage: string; // required
  @IsString()
  @IsOptional()
  sourceLanguage?: string;
}
export interface TranslateArticleResponse {
  articleId: string;
  translatedText: string;
  detectedLanguage: string;
}
