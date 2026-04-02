import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { Response } from 'express';
import { CreateArticleDto } from './articleDto/create-article.dto';
import { UpdateArticleDto } from './articleDto/update-article.dto';

@Controller('article')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  articles(@Res() res: Response) {
    return res.status(200).json(this.articlesService.getArticles());
  }

  @Get(':id')
  article(@Param('id') id: string, @Res() res: Response) {
    return res.status(200).json(this.articlesService.getArticleById(id));
  }
  @Post()
  addArticle(@Body() data: CreateArticleDto, @Res() res: Response) {
    return res.status(201).json(this.articlesService.addArticle(data));
  }
  @Put(':id')
  changeArticle(
    @Param('id') id: string,
    @Res() res: Response,
    @Body() dto: UpdateArticleDto,
  ) {
    res.status(200).json(this.articlesService.updateArticle(id, dto));
  }
  @Delete(':id')
  deleteArticle(@Param('id') id: string, @Res() res: Response) {
    const art = this.articlesService.deleteArticle(id);
    console.log(art);
    res.status(204).json(art);
  }
}
