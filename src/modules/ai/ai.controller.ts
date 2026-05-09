import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AiService } from './ai.service';
import { SummaryArticleDto } from './dto/summarize-article.dto';
import { TranslateArticleDto } from './dto/transalte-article.dto';
import { AnalyzeArticleRequestDto } from './dto/analize-article.dto';
import { RateLimitGuard } from '../ai-limiter/rate-limit.guard';

@Controller('ai/articles')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post(':articleId/summarize')
  @UseGuards(RateLimitGuard)
  async summarizeArticle(
    @Body() body: SummaryArticleDto,
    @Param('articleId', new ParseUUIDPipe({ version: '4' })) articleId: string,
  ) {
    console.log('Summarizing article with ID:', articleId);
    return this.aiService.getSummarizeArticle(articleId, body);
  }
  @Post(':articleId/translate')
  @UseGuards(RateLimitGuard)
  async translateArticle(
    @Param('articleId', new ParseUUIDPipe({ version: '4' })) articleId: string,
    @Body() body: TranslateArticleDto,
  ) {
    return this.aiService.translateArticle(articleId, body);
  }

  @Post(':articleId/analyze')
  @UseGuards(RateLimitGuard)
  async analyzeArticle(
    @Param('articleId', new ParseUUIDPipe({ version: '4' })) articleId: string,
    @Body() dto: AnalyzeArticleRequestDto,
  ) {
    return this.aiService.analyzeArticle(articleId, dto);
  }
}
