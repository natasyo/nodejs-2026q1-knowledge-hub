import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Article, Comment } from '../../core/types/data.types';
import { randomUUID } from 'node:crypto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { isUUID } from 'class-validator';
import { dataBase } from '../../core/db/db';
import { Order } from '../dto/sort-order.dto';
import { sortArray } from '../../core/functions/sort';

@Injectable()
export class CommentsService {
  comments: Comment[] = dataBase.comments;
  getComments(articleId: string, sortBy?: string, order?: Order) {
    if (!isUUID(articleId)) {
      throw new BadRequestException('Invalid UUID');
    }

    const result = dataBase.comments.filter((comment) => {
      return comment.articleId === articleId || comment.id === articleId;
    });
    if (sortBy) {
      return sortArray(result, sortBy, order ?? Order.ASC);
    }
    return result;
  }

  getById(id: string): Comment {
    if (!isUUID(id)) throw new BadRequestException('id must be UUID');
    const comment = dataBase.comments.find((item) => item.id === id);
    if (!comment) throw new NotFoundException('comment not found');
    return comment;
  }

  createComment(dto: CreateCommentDto) {
    const isExistArticle = (dataBase.articles as Article[]).some(
      (article) => article.id === dto.articleId,
    );
    if (!isExistArticle)
      throw new UnprocessableEntityException('Article not found');
    const newComment: Comment = {
      ...dto,
      createdAt: Date.now(),
      id: randomUUID(),
    };
    dataBase.comments.push(newComment);
    return newComment;
  }

  deleteComment(commentId: string) {
    if (!isUUID(commentId)) {
      throw new BadRequestException('Invalid comment id');
    }
    const comment = dataBase.comments.find(
      (item: { id: string }) => item.id === commentId,
    );
    if (!comment) throw new NotFoundException('comment not found');
    dataBase.comments = dataBase.comments.filter(
      (comment: { id: string }) => comment.id !== commentId,
    );
    return;
  }
}
