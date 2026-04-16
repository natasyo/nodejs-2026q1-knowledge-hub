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
  async getComments(@Query('articleId') articleId: string) {
    return await this.commentsService.getComments(articleId);
  }

  @Get(':id')
  @HttpCode(200)
  async getCommentsById(@Param('id') id: string) {
    return await this.commentsService.getById(id);
  }

  @Post()
  @HttpCode(201)
  async create(@Body() createCommentDto: CreateCommentDto) {
    return await this.commentsService.createComment(createCommentDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    await this.commentsService.deleteComment(id);
    return;
  }
}
