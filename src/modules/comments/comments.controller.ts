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

@Controller('comment')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}
  @Get()
  @HttpCode(200)
  getComments(@Query('articleId') articleId: string) {
    return this.commentsService.getComments(articleId);
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
