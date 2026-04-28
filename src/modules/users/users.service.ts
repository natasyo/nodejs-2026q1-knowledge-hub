import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
class UsersService {
  constructor(private readonly prismaService: PrismaService) {}
  private mapUser(user) {
    return {
      ...user,
      role: user.role.toLowerCase(),
      createdAt: user.createdAt.getTime(),
      updatedAt: user.updatedAt.getTime(),
    };
  }
  async getUsers() {
    return this.prismaService.user.findMany({
      select: {
        login: true,
        id: true,
        role: true,
        updatedAt: true,
        createdAt: true,
      },
    });
  }
  async getUserById(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: {
        login: true,
        id: true,
        role: true,
        updatedAt: true,
        createdAt: true,
      },
    });
    if (!user) throw new NotFoundException('user not found');
    return this.mapUser(user);
  }
  async addUser(user: CreateUserDto) {
    try {
      const result = await this.prismaService.user.create({
        data: {
          login: user.login,
          password: user.password,
        },
        select: {
          login: true,
          id: true,
          role: true,
          updatedAt: true,
          createdAt: true,
        },
      });
      return this.mapUser(result);
    } catch (e) {
      if (e.code === 'P2002') {
        throw new NotFoundException(`Login ${user.login} exists`);
      }
      throw e;
    }
  }

  async updatePassword(userId: string, dto: UpdatePasswordDto) {
    if (!isUUID(userId)) {
      throw new BadRequestException('Invalid UUID');
    }
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('user not found');
    if (user.password !== dto.oldPassword) {
      throw new ForbiddenException('Is not valid old password');
    }
    try {
      const result = await this.prismaService.user.update({
        where: { id: userId },
        data: {
          password: dto.newPassword,
        },
        select: {
          login: true,
          id: true,
          role: true,
          updatedAt: true,
          createdAt: true,
        },
      });
      return this.mapUser(result);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      throw error;
    }
  }
  async deleteUser(userId: string) {
    if (!isUUID(userId)) {
      throw new BadRequestException('Invalid user id');
    }
    try {
      await this.prismaService.user.delete({
        where: { id: userId },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      throw error;
    }
  }
}

export default UsersService;
