import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import UsersService from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUser() {
    return await this.usersService.getUsers();
  }

  @Get(':id')
  @HttpCode(200)
  async getUserById(@Param('id') id: string) {
    return await this.usersService.getUserById(id);
  }

  @Post()
  @HttpCode(201)
  async createUser(@Body() user: CreateUserDto) {
    return await this.usersService.addUser(user);
  }
  @Put(':id')
  @HttpCode(200)
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return await this.usersService.updatePassword(id, updatePasswordDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param('id') id: string) {
    await this.usersService.deleteUser(id);
  }
}
