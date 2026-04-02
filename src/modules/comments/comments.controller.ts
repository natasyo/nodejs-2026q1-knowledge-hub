import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Response } from 'express';

@Controller('comment')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}
  @Get(':articleId')
  getComments(@Param('articleId') articleId: string, @Res() res: Response) {
    res.status(200).json(this.commentsService.getComments(articleId));
  }
  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @Res() res: Response) {
    res.status(201).json(this.commentsService.createComment(createCommentDto));
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Res() res: Response) {
    res.status(204).json(this.commentsService.deleteComment(id));
  }
}
