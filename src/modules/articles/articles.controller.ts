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
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './articleDto/create-article.dto';
import { UpdateArticleDto } from './articleDto/update-article.dto';
import { SortOrderDto } from '../dto/sort-order.dto';
import { ArticleQueryDto } from './articleDto/article-query.dto';

@Controller('article')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  @HttpCode(200)
  getArticleByStatus(@Query() query: ArticleQueryDto) {
    const { status, tag, categoryId, sortBy, order } = query;
    if (status)
      return this.articlesService.getArticleByStatus(status, sortBy, order);
    if (tag) return this.articlesService.getArticlesByTag(tag, sortBy, order);
    if (categoryId)
      return this.articlesService.getArticleByCategoryId(
        categoryId,
        sortBy,
        order,
      );
    return this.articlesService.getArticles(sortBy, order);
  }

  @HttpCode(200)
  @Get(':id')
  article(@Param('id') id: string) {
    return this.articlesService.getArticleById(id);
  }

  @Post()
  @HttpCode(201)
  addArticle(@Body() data: CreateArticleDto) {
    return this.articlesService.addArticle(data);
  }

  @Put(':id')
  @HttpCode(200)
  changeArticle(@Param('id') id: string, @Body() dto: UpdateArticleDto) {
    return this.articlesService.updateArticle(id, dto);
  }
  @Delete(':id')
  @HttpCode(204)
  deleteArticle(@Param('id') id: string) {
    this.articlesService.deleteArticle(id);
    return;
  }
}
