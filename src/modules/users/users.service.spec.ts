import { Test, TestingModule } from '@nestjs/testing';
import UsersService from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '../../../generated/prisma/enums';
import { vi } from 'vitest';
import * as classValidator from 'class-validator';
import { BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;
  const mockUser = {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    login: 'login',
    password: 'password',
    role: Role.VIEWER,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const mockUserReturn = {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    login: 'login',
    password: 'password',
    role: Role.VIEWER.toLowerCase(),
    createdAt: mockUser.createdAt.getTime(),
    updatedAt: mockUser.updatedAt.getTime(),
  };
  const validId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findMany: vi.fn(),
              findUnique: vi.fn(),
              create: vi.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });
  describe('get users', () => {
    it('should be able to get users', async () => {
      vi.mocked(prismaService.user.findMany).mockResolvedValue([
        mockUser,
        mockUser,
      ]);
      const result = await service.getUsers();
      expect(result).toEqual([mockUser, mockUser]);
    });
  });
  describe('get user by id', async () => {
    it('should return  BadRequestException', async () => {
      await expect(service.getUserById('id')).rejects.toThrow(
        BadRequestException,
      );
    });
    it('should return user', async () => {
      vi.mocked(prismaService.user.findUnique).mockResolvedValue(mockUser);
      const result = await service.getUserById(validId);
      expect(result).toEqual(mockUserReturn);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: validId },
        }),
      );
    });
  });
  describe('create user', async () => {
    it('should be able to create user', async () => {
      const createUserDto: CreateUserDto = {
        login: 'login',
        password: 'password',
      };
      vi.mocked(prismaService.user.create).mockResolvedValue(mockUser);
      const result = await service.addUser(createUserDto);
      expect(result).toEqual(mockUserReturn);
    });
  });
});
