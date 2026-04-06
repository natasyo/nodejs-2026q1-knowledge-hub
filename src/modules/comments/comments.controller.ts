import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { QueryComments } from './dto/query-comments.dto';
import { Order } from '../dto/sort-order.dto';

@Controller('comment')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}
  @Get()
  @HttpCode(200)
  getComments(@Query() query: QueryComments) {
    const { articleId, sortBy, order } = query;
    return this.commentsService.getComments(articleId, sortBy, order);
  }

  @Get(':id')
  @HttpCode(200)
  getCommentsById(@Param('id') id: string) {
    return this.commentsService.getById(id);
  }

  @Post()
  @HttpCode(201)
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.createComment(createCommentDto);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string) {
    this.commentsService.deleteComment(id);
    return;
  }
}
