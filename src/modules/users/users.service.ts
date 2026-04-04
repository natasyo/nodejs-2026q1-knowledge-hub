import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Article, User, Comment } from '../../core/types/data.types';
import { randomUUID } from 'node:crypto';
import { isUUID } from 'class-validator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { dataBase } from '../../core/db/db';
import { UserRole } from '../../core/types/UserRole';

@Injectable()
export class UsersService {
  getUsers(): User[] {
    return dataBase.users.map((password: any, ...user: any) => user);
  }
  getUserById(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const user = dataBase.users.find((user) => user.id === id);
    if (!user) throw new NotFoundException('user not found');
    const { password, ...userData } = user;
    return userData;
  }
  addUser(user: CreateUserDto) {
    const newUser = {
      createdAt: Date.now(),
      updatedAt: Date.now(),
      id: randomUUID(),
      ...user,
    } as User;
    if (newUser.role === undefined) newUser.role = UserRole.VIEWER;
    dataBase.users.push(newUser);
    const { password, ...userData } = newUser;
    return userData;
  }

  updatePassword(userId: string, dto: UpdatePasswordDto) {
    if (!isUUID(userId)) {
      throw new BadRequestException('Invalid UUID');
    }
    const user = dataBase.users.find((user) => user.id === userId);
    if (!user) throw new NotFoundException('user not found');
    if (user.password !== dto.oldPassword) {
      throw new ForbiddenException('Is not valid old password');
    }
    dataBase.users.forEach((item) => {
      if (item.id === userId) item.password = dto.newPassword;
      item.updatedAt = Date.now();
    });
    return user;
  }
  deleteUser(userId: string) {
    if (!isUUID(userId)) {
      throw new BadRequestException('Invalid user id');
    }
    const user = dataBase.users.find(
      (user: { id: string }) => user.id === userId,
    );
    if (!user) throw new NotFoundException('user not found');
    dataBase.users = dataBase.users.filter(
      (user: { id: string }) => user.id !== userId,
    );
    dataBase.comments = (dataBase.comments as Comment[]).filter((item) => {
      return item.authorId !== userId;
    });
    (dataBase.articles as Article[]).forEach((item) => {
      if (item.authorId === userId) item.authorId = null;
    });
    return user;
  }
}
