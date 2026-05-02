import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';
import { SummaryArticleDto } from './dto/summarize-article.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('articles')
  async summarizeArticle(@Body() body: SummaryArticleDto) {
    return this.aiService.getSummarizeArticle(body);
  }
}
