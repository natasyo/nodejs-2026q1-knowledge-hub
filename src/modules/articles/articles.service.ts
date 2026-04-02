import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Article } from '../../core/types/data.types';
import { randomUUID } from 'node:crypto';
import { isUUID } from 'class-validator';
import { CreateArticleDto } from './articleDto/create-article.dto';
import { UpdateArticleDto } from './articleDto/update-article.dto';

@Injectable()
export class ArticlesService {
  articles: Article[] = [
    {
      id: randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      authorId: randomUUID(),
      categoryId: randomUUID(),
      content: 'sdfjsdhfjdshfkj',
      status: 'draft',
      tags: ['dsfds', 'sdfsd'],
      title: 'fsjdfkj',
    },
    {
      id: randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      authorId: randomUUID(),
      categoryId: randomUUID(),
      content: 'sdfjsdhfjdfgdfgdshfkj',
      status: 'draft',
      tags: ['ddgdfgdfgsfds', 'sdfdgdfgsd'],
      title: 'fsdfgfdgjdfkj',
    },
  ];

  getArticles() {
    return this.articles;
  }
  getArticleById(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const article = this.articles.find((article) => article.id === id);
    if (!article) throw new NotFoundException('Article not found');
    return article;
  }
  addArticle(article: CreateArticleDto) {
    const newUser = {
      createdAt: Date.now(),
      updatedAt: Date.now(),
      id: randomUUID(),
      ...article,
    } as Article;
    this.articles.push(newUser);
    return newUser;
  }

  updateArticle(articleId: string, dto: UpdateArticleDto) {
    if (!isUUID(articleId)) {
      throw new BadRequestException('Invalid UUID');
    }
    const article = this.articles.find((item) => item.id === articleId);
    if (!article) throw new NotFoundException('Article not found');
    const updateArticle = {
      ...article,
      ...dto,
      updatedAt: Date.now(),
    };

    this.articles = this.articles.map((item) => {
      if (item.id === articleId) return updateArticle;
      return item;
    });
    return article;
  }
  deleteArticle(articleId: string) {
    if (!isUUID(articleId)) {
      throw new BadRequestException('Invalid user id');
    }
    const article = this.articles.find((item) => item.id === articleId);
    if (!article) throw new NotFoundException('Article not found');
    this.articles = this.articles.filter((article) => article.id !== articleId);
    return article;
  }
}
