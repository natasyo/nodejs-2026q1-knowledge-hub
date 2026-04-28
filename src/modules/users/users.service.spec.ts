import { Test, TestingModule } from '@nestjs/testing';
import UsersService from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '../../../generated/prisma/enums';
import { vi } from 'vitest';
import bcrypt from 'bcrypt';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

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
              update: vi.fn(),
              delete: vi.fn(),
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
      expect(prismaService.user.findMany).toHaveBeenCalled();
    });
  });
  describe('get user by id', async () => {
    it('should return  BadRequestException', async () => {
      await expect(service.getUserById('id')).rejects.toThrow(
        BadRequestException,
      );
    });
    it('should return NotFoundException', async () => {
      vi.mocked(prismaService.user.findUnique).mockResolvedValue(null);
      await expect(service.getUserById(mockUser.id)).rejects.toThrow(
        NotFoundException,
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
    it('should return BadRequestException if login already exists', async () => {
      const createUserDto: CreateUserDto = {
        login: 'login',
        password: 'password',
      };
      vi.mocked(prismaService.user.create).mockRejectedValue(
        new BadRequestException('Login already exists'),
      );
      await expect(service.addUser(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
    it('should rethrow unexpected database error', async () => {
      const createUserDto: CreateUserDto = {
        login: 'login',
        password: 'password',
      };
      const unexpectedError = new Error('database connection failed');
      vi.mocked(prismaService.user.create).mockRejectedValue(unexpectedError);
      await expect(service.addUser(createUserDto)).rejects.toThrow(
        unexpectedError,
      );
    });
  });
  describe('update password', async () => {
    it('should be able update password', async () => {
      const updatePasswordDto: UpdatePasswordDto = {
        oldPassword: mockUser.password,
        newPassword: 'newPassword',
      };
      vi.mocked(prismaService.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(prismaService.user.update).mockResolvedValue(mockUser);
      const result = await service.updatePassword(validId, updatePasswordDto);
      expect(result).toEqual(mockUserReturn);
      expect(prismaService.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: validId },
          data: expect.objectContaining({
            password: expect.any(String),
          }),
        }),
      );
    });
    it('should return BadRequestException if incorrect id', async () => {
      const updatePasswordDto: UpdatePasswordDto = {
        oldPassword: mockUser.password,
        newPassword: 'newPassword',
      };
      await expect(
        service.updatePassword('id', updatePasswordDto),
      ).rejects.toThrow(BadRequestException);
    });
    it('should return NotFoundException if user not found', async () => {
      const updatePasswordDto: UpdatePasswordDto = {
        oldPassword: mockUser.password,
        newPassword: 'newPassword',
      };
      vi.mocked(prismaService.user.findUnique).mockResolvedValue(null);
      await expect(
        service.updatePassword(validId, updatePasswordDto),
      ).rejects.toThrow(NotFoundException);
    });
    it('should return ForbiddenException if old password is incorrect', async () => {
      const updatePasswordDto: UpdatePasswordDto = {
        oldPassword: 'incorrectPassword',
        newPassword: 'newPassword',
      };
      vi.mocked(prismaService.user.findUnique).mockResolvedValue(mockUser);
      await expect(
        service.updatePassword(validId, updatePasswordDto),
      ).rejects.toThrow(ForbiddenException);
    });
    it('should rethrow unexpected database error', async () => {
      const updatePasswordDto: UpdatePasswordDto = {
        oldPassword: mockUser.password,
        newPassword: 'newPassword',
      };
      const unexpectedError = new Error('database connection failed');
      vi.mocked(prismaService.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(prismaService.user.update).mockRejectedValue(unexpectedError);

      vi.mocked(prismaService.user.delete).mockRejectedValue(unexpectedError);
      await expect(
        service.updatePassword(mockUser.id, updatePasswordDto),
      ).rejects.toThrow(unexpectedError);
    });
  });
  describe('delete user', async () => {
    it('should return NotFoundException if user not found', async () => {
      const validId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
      vi.mocked(prismaService.user.delete).mockRejectedValue(
        new NotFoundException(),
      );
      await expect(service.deleteUser(validId)).rejects.toThrow(
        NotFoundException,
      );
      expect(prismaService.user.delete).toHaveBeenCalled();
      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: { id: validId },
      });
    });
    it('should delete user if user found', async () => {
      const validId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
      vi.mocked(prismaService.user.delete).mockResolvedValue(mockUser);
      await expect(service.deleteUser(validId)).resolves.toEqual(true);
      expect(prismaService.user.delete).toHaveBeenCalled();
      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: { id: validId },
      });
    });
    it('should return BadRequestException if incorrect id', async () => {
      await expect(service.deleteUser('id')).rejects.toThrow(
        BadRequestException,
      );
    });
    it('should rethrow unexpected database error', async () => {
      const unexpectedError = new Error('database connection failed');
      vi.mocked(prismaService.user.delete).mockRejectedValue(unexpectedError);
      await expect(service.deleteUser(mockUser.id)).rejects.toThrow(
        unexpectedError,
      );
    });
  });
});
