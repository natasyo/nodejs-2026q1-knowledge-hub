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
import { dataBase } from '../../core/db/db';
import { sortArray } from '../../core/functions/sort';
import { Order } from '../dto/sort-order.dto';

@Injectable()
export class ArticlesService {
  articles: Article[] = dataBase.articles as unknown as Article[];
  getArticles(sortBy?: string, order?: Order) {
    if (sortBy) {
      return sortArray(dataBase.articles, sortBy, order ?? Order.ASC);
    }

    return dataBase.articles;
  }
  getArticleById(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const article = dataBase.articles.find((article) => article.id === id);
    if (!article) throw new NotFoundException('Article not found');
    return article;
  }

  getArticleByStatus(status: string, sortBy?: string, order?: Order) {
    if (sortBy) {
      return sortArray(dataBase.articles, sortBy, order ?? Order.ASC);
    }
    return dataBase.articles.filter((article) => {
      return article.status === status;
    });
  }
  getArticlesByTag(tag: string, sortBy?: string, order?: Order) {
    if (sortBy) {
      return sortArray(dataBase.articles, sortBy, order ?? Order.ASC);
    }
    return dataBase.articles.filter((article) => {
      return article.tags.includes(tag);
    });
  }
  getArticleByCategoryId(categoryId: string, sortBy?: string, order?: Order) {
    if (sortBy) {
      return sortArray(dataBase.articles, sortBy, order ?? Order.ASC);
    }
    return dataBase.articles.filter((article) => {
      return article.categoryId === categoryId;
    });
  }
  addArticle(article: CreateArticleDto) {
    const newUser = {
      createdAt: Date.now(),
      updatedAt: Date.now(),
      id: randomUUID(),
      ...article,
    } as Article;
    dataBase.articles.push(newUser);
    return newUser;
  }

  updateArticle(articleId: string, dto: UpdateArticleDto) {
    if (!isUUID(articleId)) {
      throw new BadRequestException('Invalid UUID');
    }

    const article = dataBase.articles.find((item) => item.id === articleId);
    console.log(article);
    if (!article) throw new NotFoundException('Article not found');
    const updateArticle = {
      ...article,
      ...dto,
      updatedAt: Date.now(),
    };

    dataBase.articles = dataBase.articles.map((item) => {
      if (item.id === articleId) return updateArticle;
      return item;
    });
    return updateArticle;
  }
  deleteArticle(articleId: string) {
    if (!isUUID(articleId)) {
      throw new BadRequestException('Invalid user id');
    }
    const article = dataBase.articles.find((item) => item.id === articleId);
    if (!article) throw new NotFoundException('Article not found');
    dataBase.articles = dataBase.articles.filter(
      (article) => article.id !== articleId,
    );
    dataBase.comments = dataBase.comments.filter(
      (comment) => comment.articleId !== articleId,
    );
    return article;
  }
}
