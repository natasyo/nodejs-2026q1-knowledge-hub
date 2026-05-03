import { Body, Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { AiService } from './ai.service';
import { SummaryArticleDto } from './dto/summarize-article.dto';
import { TranslateArticleDto } from './dto/transalte-article.dto';

@Controller('ai/articles')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post(':articleId/summarize')
  async summarizeArticle(
    @Body() body: SummaryArticleDto,
    @Param('articleId', new ParseUUIDPipe({ version: '4' })) articleId: string,
  ) {
    console.log('Summarizing article with ID:', articleId);
    return this.aiService.getSummarizeArticle(articleId, body);
  }
  @Post(':articleId/translate')
  async translateArticle(
    @Param('articleId', new ParseUUIDPipe({ version: '4' })) articleId: string,
    @Body() body: TranslateArticleDto,
  ) {
    return this.aiService.translateArticle(articleId, body);
  }
}
