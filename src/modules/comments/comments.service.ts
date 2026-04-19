import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { isUUID } from 'class-validator';
import { dataBase } from '../../core/db/db';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private readonly prismaService: PrismaService) {}
  async getComments(articleId: string) {
    if (!isUUID(articleId)) {
      throw new BadRequestException('Invalid UUID');
    }
    return this.prismaService.comment.findMany();
  }

  async getById(id: string) {
    if (!isUUID(id)) throw new BadRequestException('id must be UUID');
    const comment = await this.prismaService.comment.findUnique({
      where: { id },
    });
    if (!comment) throw new NotFoundException('comment not found');
    return comment;
  }

  async createComment(dto: CreateCommentDto) {
    const isExistArticle = await this.prismaService.article.findUnique({
      where: {
        id: dto.articleId,
      },
    });
    if (!isExistArticle)
      throw new UnprocessableEntityException('Article not found');

    return this.prismaService.comment.create({
      data: {
        content: dto.content,
        article: {
          connect: { id: dto.articleId },
        },
      },
    });
  }

  async deleteComment(commentId: string) {
    if (!isUUID(commentId)) {
      throw new BadRequestException('Invalid comment id');
    }
    const comment = await this.prismaService.comment.findUnique({
      where: { id: commentId },
    });
    if (!comment) throw new NotFoundException('comment not found');
    await this.prismaService.comment.delete({
      where: { id: commentId },
    });
    return;
  }
}
