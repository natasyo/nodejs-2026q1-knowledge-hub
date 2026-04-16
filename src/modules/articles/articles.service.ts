import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Article } from '../../core/types/data.types';
import { isUUID } from 'class-validator';
import { CreateArticleDto } from './articleDto/create-article.dto';
import { UpdateArticleDto } from './articleDto/update-article.dto';
import { dataBase } from '../../core/db/db';
import { PrismaService } from '../prisma/prisma.service';
import { Status } from '@prisma/client';

@Injectable()
export class ArticlesService {
  constructor(private readonly prismaService: PrismaService) {}
  articles: Article[] = dataBase.articles as unknown as Article[];
  async getArticles() {
    return this.prismaService.article.findMany();
  }
  async getArticleById(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const article = await this.prismaService.article.findUnique({
      where: { id },
    });
    if (!article) throw new NotFoundException('Article not found');
    return article;
  }

  async getArticleByStatus(status: string) {
    return this.prismaService.article.findMany({
      where: {
        status: status.toUpperCase() as Status,
      },
    });
  }
  async getArticlesByTag(tag: string) {
    const tagObj = await this.prismaService.tag.findUnique({
      where: { name: tag },
    });
    if (!tagObj) throw new NotFoundException('Tag not found');
    return this.prismaService.article.findMany({
      where: {
        tags: {
          some: {
            name: tag,
          },
        },
      },
    });
  }
  async getArticleByCategoryId(categoryId: string) {
    if (!isUUID(categoryId)) {
      throw new BadRequestException('Invalid UUID');
    }
    return this.prismaService.article.findMany({
      where: {
        categoryId,
      },
    });
  }
  async addArticle(article: CreateArticleDto) {
    return this.prismaService.article.create({
      data: {
        content: article.content,
        ...(article.authorId && {
          author: { connect: { id: article.authorId } },
        }),
        ...(article.categoryId && {
          category: { connect: { id: article.categoryId } },
        }),
        title: article.title,
      },
    });
  }

  async updateArticle(articleId: string, dto: UpdateArticleDto) {
    if (!isUUID(articleId)) {
      throw new BadRequestException('Invalid UUID');
    }
    try {
      return await this.prismaService.article.update({
        where: {
          id: articleId,
        },
        data: {
          title: dto.title,
          content: dto.content,
          ...(dto.authorId && {
            author: { connect: { id: dto.authorId } },
          }),
          ...(dto.categoryId && {
            category: { connect: { id: dto.categoryId } },
          }),
          tags: dto.tags ? { set: dto.tags.map((id) => ({ id })) } : undefined,
        },
      });
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException(`Article with ID ${articleId} not found`);
      throw error;
    }
  }
  async deleteArticle(articleId: string) {
    if (!isUUID(articleId)) {
      throw new BadRequestException('Invalid article id');
    }
    try {
      return await this.prismaService.article.delete({
        where: { id: articleId },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Article not found');
      }
      throw error;
    }
  }
}
