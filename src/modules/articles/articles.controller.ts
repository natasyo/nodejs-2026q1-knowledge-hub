import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './articleDto/create-article.dto';
import { UpdateArticleDto } from './articleDto/update-article.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Response } from 'express';
import { GetArticlesQueryDto } from './articleDto/get-articles-query.dto';

@UseGuards(JwtAuthGuard)
@Controller('article')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  @HttpCode(200)
  getArticleByStatus(@Query() query: GetArticlesQueryDto) {
    if (query.status)
      return this.articlesService.getArticleByStatus(query.status);
    if (query.tag) return this.articlesService.getArticlesByTag(query.tag);
    if (query.categoryId)
      return this.articlesService.getArticleByCategoryId(query.categoryId);
    return this.articlesService.getArticles();
  }

  @HttpCode(200)
  @Get(':id')
  article(@Param('id') id: string) {
    return this.articlesService.getArticleById(id);
  }

  @Post()
  @HttpCode(201)
  async addArticle(@Body() data: CreateArticleDto) {
    return await this.articlesService.addArticle(data);
  }

  @Put(':id')
  @HttpCode(200)
  async changeArticle(
    // @Res() res: Response,
    @Param('id') id: string,
    @Body() dto: UpdateArticleDto,
    @Res() res: Response,
  ) {
    const result = await this.articlesService.updateArticle(id, dto);
    res.json(result);
  }
  @Delete(':id')
  @HttpCode(204)
  async deleteArticle(@Param('id') id: string) {
    await this.articlesService.deleteArticle(id);
    return;
  }
}
