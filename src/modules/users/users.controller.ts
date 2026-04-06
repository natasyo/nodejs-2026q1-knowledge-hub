import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  HttpCode,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { SortOrderDto } from '../dto/sort-order.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUser(@Query() query: SortOrderDto) {
    return this.usersService.getUsers(query);
  }

  @Get(':id')
  @HttpCode(200)
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id).userData;
  }

  @Post()
  @HttpCode(201)
  createUser(@Body() user: CreateUserDto) {
    return this.usersService.addUser(user).userData;
  }
  @Put(':id')
  @HttpCode(200)
  updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    this.usersService.updatePassword(id, updatePasswordDto);
    return;
  }

  @Delete(':id')
  @HttpCode(204)
  deleteUser(@Param('id') id: string) {
    this.usersService.deleteUser(id);
  }
}
