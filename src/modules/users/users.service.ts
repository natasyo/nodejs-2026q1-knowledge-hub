import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../../core/types/data.types';
import { randomUUID } from 'node:crypto';
import { isUUID } from 'class-validator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UsersService {
  users: User[] = [
    {
      id: randomUUID(),
      createdAt: Date.now(),
      login: 'user1',
      password: 'password',
      role: 'admin',
      updatedAt: Date.now(),
    },
    {
      id: randomUUID(),
      createdAt: Date.now(),
      login: 'user1',
      password: 'password',
      role: 'admin',
      updatedAt: Date.now(),
    },
  ];

  getUsers() {
    console.log(JSON.stringify(this.users));
    return this.users;
  }
  getUserById(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const user = this.users.find((user) => user.id === id);
    if (!user) throw new NotFoundException('user not found');
    return user;
  }
  addUser(user: CreateUserDto) {
    const newUser = {
      createdAt: Date.now(),
      updatedAt: Date.now(),
      id: randomUUID(),
      ...user,
    } as User;
    this.users.push(newUser);
    return newUser;
  }

  updatePassword(userId: string, dto: UpdatePasswordDto) {
    if (!isUUID(userId)) {
      throw new BadRequestException('Invalid UUID');
    }
    const user = this.users.find((user) => user.id === userId);
    if (!user) throw new NotFoundException('user not found');
    if (user.password !== dto.oldPassword) {
      throw new ForbiddenException('Is not valid old password');
    }
    user.password = dto.newPassword;
    return user;
  }
  deleteUser(userId: string) {
    if (!isUUID(userId)) {
      throw new BadRequestException('Invalid user id');
    }
    const user = this.users.find((user) => user.id === userId);
    if (!user) throw new NotFoundException('user not found');
    this.users = [];
    return user;
  }
}
