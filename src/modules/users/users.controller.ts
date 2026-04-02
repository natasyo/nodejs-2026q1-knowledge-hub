import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUser(@Req() req: Request, @Res() res: Response) {
    res.status(200).json({ data: this.usersService.getUsers() });
  }

  @Get(':id')
  getUserById(@Param('id') id: string, @Res() res: Response) {
    res.status(201).json({
      data: this.usersService.getUserById(id),
    });
  }

  @Post()
  createUser(@Body() user: CreateUserDto, @Res() res: Response) {
    res.status(201).json(this.usersService.addUser(user));
  }
  @Put(':id')
  updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Res() res: Response,
  ) {
    res
      .status(201)
      .json(
        this.usersService.addUser(
          this.usersService.updatePassword(id, updatePasswordDto),
        ),
      );
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string, @Res() res: Response) {
    res
      .status(204)
      .json(this.usersService.addUser(this.usersService.deleteUser(id)));
  }
}
