import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Comment } from '../../core/types/data.types';
import { randomUUID } from 'node:crypto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { isUUID } from 'class-validator';
@Injectable()
export class CommentsService {
  comments: Comment[] = [
    {
      content: 'dsfnsdkjfkl',
      id: randomUUID(),
      articleId: '6a0b63e8-a60a-4dab-9c32-36eb59928f70',
      authorId: randomUUID(),
      createdAt: Date.now(),
    },
    {
      content: 'dsfns dkjfkl',
      id: randomUUID(),
      articleId: '6a0b63e8-a60a-4dab-9c32-36eb59928f70',
      authorId: randomUUID(),
      createdAt: Date.now(),
    },
    {
      content: 'dsfn sdkfghfg fghjfkl',
      id: randomUUID(),
      articleId: 'a59d4849-973c-4212-8706-ce102cc3cadf',
      authorId: randomUUID(),
      createdAt: Date.now(),
    },
  ];

  getComments(articleId: string) {
    const comments = this.comments.filter((comment) => {
      console.log(comment.articleId, articleId);
      return comment.articleId === articleId;
    });
    console.log(comments);
    return comments;
  }

  createComment(dto: CreateCommentDto) {
    const newComment: Comment = {
      ...dto,
      createdAt: Date.now(),
      id: randomUUID(),
    };
    this.comments.push(newComment);
    return newComment;
  }

  deleteComment(commentId: string) {
    if (!isUUID(commentId)) {
      throw new BadRequestException('Invalid comment id');
    }
    const comment = this.comments.find((item) => item.id === commentId);
    if (!comment) throw new NotFoundException('comment not found');
    this.comments = this.comments.filter((comment) => comment.id !== commentId);
    return this.comments;
  }
}
