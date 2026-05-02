import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import {
  SummarizeArticleResponse,
  SummaryArticleDto,
} from './dto/summarize-article.dto';
import { ArticlesService } from '../articles/articles.service';

@Injectable()
export class AiService {
  constructor(
    private readonly googleGenAI: GoogleGenAI,
    private readonly articleService: ArticlesService,
  ) {}
  async getSummarizeArticle(
    dto: SummaryArticleDto,
  ): Promise<SummarizeArticleResponse> {
    const article = await this.articleService.getArticleById(dto.articleId);

    const response = await this.googleGenAI.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Summarize the following article. Length: ${dto.maxLength || 'medium'}. Text: ${article.content}`,
    });
    const summaryText = response.text;
    return {
      summary: response.text,
      articleId: article.id,
      summaryLength: summaryText.length,
      originalLength: article.content.length,
    };
  }
}
