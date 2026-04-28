import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import UsersService from './users.service';
import { vi } from 'vitest';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser = {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    login: 'testlogin',
    role: 'viewer',
    createdAt: 1704067200000,
    updatedAt: 1704067200000,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getUsers: vi.fn(),
            getUserById: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });
  describe('GET /user', () => {
    it('should return all users', async () => {
      const mockUsers = [mockUser, mockUser];
      vi.mocked(service.getUsers).mockResolvedValue(mockUsers as any);
      const result = await controller.getUser();
      expect(result).toEqual(mockUsers);
      expect(service.getUsers).toHaveBeenCalled();
    });
    it('should return empty array if no users found', async () => {
      vi.mocked(service.getUsers).mockResolvedValue([]);
      const result = await controller.getUser();
      expect(result).toEqual([]);
      expect(service.getUsers).toHaveBeenCalled();
    });
  });
  describe('Get user/:id', async () => {
    it('should return user by id', async () => {
      vi.mocked(service.getUserById).mockResolvedValue(mockUser);
      const result = await controller.getUserById(mockUser.id);
      expect(result).toEqual(mockUser);
      expect(service.getUserById).toHaveBeenCalled();
    });
  });
});
