import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import usersService from '../users/users.service';
import { vi } from 'vitest';
import { LoginDto } from './dto/login.dto';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Role } from '../../../generated/prisma/enums';

vi.mock('bcryptjs', () => ({
  compare: vi.fn(),
  hash: vi.fn(),
}));

import * as bcrypt from 'bcryptjs';
import { Logger, PinoLogger } from 'nestjs-pino';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const mockUser = {
    id: 'id',
    login: 'login',
    password: 'password',
    role: Role.VIEWER,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findFirst: vi.fn(),
              create: vi.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: vi.fn(),
          },
        },
        {
          provide: Logger,
          useValue: {
            info: vi.fn(),
            log: vi.fn(),
            error: vi.fn(),
            setContext: vi.fn(),
          },
        },
        {
          provide: PinoLogger,
          useValue: {
            setContext: vi.fn(),
            info: vi.fn(),
            error: vi.fn(),
            warn: vi.fn(),
            debug: vi.fn(),
          },
        },
      ],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    service = module.get<AuthService>(AuthService);
  });
  afterAll(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });
  describe('login', async () => {
    it('should throw UnauthorizedException if user not found', async () => {
      const loginDTO: LoginDto = {
        login: 'login',
        password: 'password',
      };
      vi.mocked(prismaService.user.findFirst).mockResolvedValue(null);
      await expect(service.login(loginDTO)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: {
          login: loginDTO.login,
        },
      });
    });
    it('should throw UnauthorizedException if password invalid', async () => {
      const loginDTO: LoginDto = {
        login: 'login',
        password: 'password1',
      };
      vi.mocked(prismaService.user.findFirst).mockResolvedValue(mockUser);
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);
      await expect(service.login(loginDTO)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: { login: loginDTO.login },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDTO.password,
        mockUser.password,
      );
    });
  });
  describe('signup', async () => {
    it('should create user', async () => {
      const loginDTO: LoginDto = {
        login: 'login',
        password: 'password',
      };
      const accessToken = 'access_token';
      const hashedPassword = 'hashed_password';
      vi.mocked(bcrypt.hash).mockResolvedValue(hashedPassword as any);
      vi.mocked(prismaService.user.create).mockResolvedValue({
        id: 'id',
        login: loginDTO.login,
        role: 'VIEWER',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);
      const result = await service.signup(loginDTO);
      expect(bcrypt.hash).toHaveBeenCalledWith(loginDTO.password, 12);
      expect(result.login).toBe(loginDTO.login);
    });
    it('should throw if user already exists', async () => {
      const loginDTO: LoginDto = {
        login: 'login',
        password: 'password',
      };
      const hashedPassword = 'hashed_password';
      vi.mocked(bcrypt.hash).mockResolvedValue(hashedPassword as any);
      vi.mocked(prismaService.user.create).mockRejectedValue({
        code: 'P2002',
      });
      await expect(service.signup(loginDTO)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
