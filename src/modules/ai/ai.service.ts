import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import {
  SummarizeArticleResponse,
  SummaryArticleDto,
} from './dto/summarize-article.dto';
import { ArticlesService } from '../articles/articles.service';
import {
  TranslateArticleDto,
  TranslateArticleResponse,
} from './dto/transalte-article.dto';
import {
  AnalyzeArticleRequestDto,
  AnalyzeArticleResponse,
  Task,
} from './dto/analize-article.dto';

@Injectable()
export class AiService {
  constructor(
    private readonly googleGenAI: GoogleGenAI,
    private readonly articleService: ArticlesService,
  ) {}
  async getSummarizeArticle(
    id: string,
    dto: SummaryArticleDto,
  ): Promise<SummarizeArticleResponse> {
    const article = await this.articleService.getArticleById(id);

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
  async translateArticle(
    id: string,
    dto: TranslateArticleDto,
  ): Promise<TranslateArticleResponse> {
    const article = await this.articleService.getArticleById(id);
    const response = await this.googleGenAI.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the following text.
    1. Detect the source language.
    2. Translate the text into ${dto.targetLanguage}.    
    ${dto.sourceLanguage && `3. Original ${dto.sourceLanguage}`} 

    Return JSON format:
    {
      "detectedLanguage": "ISO 639-1 code",
      "translatedText": "string"
    }
 Text to analyze: "${article.content}"
`,
    });

    const result = JSON.parse(response.text);
    return {
      translatedText: result.translatedText,
      articleId: id,
      detectedLanguage: result.detectedLanguage,
    };
  }

  async analyzeArticle(
    id: string,
    dto: AnalyzeArticleRequestDto,
  ): Promise<AnalyzeArticleResponse> {
    try {
      const article = await this.articleService.getArticleById(id);
      const prompt = `
      Тебе дана статья для анализа. Задача: ${dto.task}.
      Текст статьи: ${article.content}
      
      Answer strictly in JSON format corresponding to the interface:
      {
        "analysis": "detailed analysis text",
        "suggestions": ["tip 1", "tip 2"],
        "severity": "info" | "warning" | "error"
      }
    `;
      const response = await this.googleGenAI.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [prompt],
      });
      const result = JSON.parse(response.text);
      return {
        articleId: id,
        ...result,
      };
    } catch (error) {
      console.error(`Error analyzing article ${id}:`, error);
      throw error;
    }
  }
}
