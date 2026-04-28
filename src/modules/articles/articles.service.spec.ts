import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesService } from './articles.service';
import { PrismaService } from '../prisma/prisma.service';
import { vi } from 'vitest';
import { CreateArticleDto } from './articleDto/create-article.dto';
import { Status } from '../../../generated/prisma/enums';

describe('ArticlesService', () => {
  let service: ArticlesService;
  let prismaService: PrismaService;

  const mockArticle = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    title: 'Test Article',
    content: 'Test content',
    status: 'published',
    authorId: '550e8400-e29b-41d4-a716-446655440001',
    categoryId: '550e8400-e29b-41d4-a716-446655440002',
    createdAt: new Date('2026-04-26T10:08:50.372Z').getTime(),
    updatedAt: new Date('2026-04-26T10:08:50.372Z').getTime(),
    tags: [],
  };
  const mockArticleFromDb = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    title: 'Test Article',
    content: 'Test content',
    status: 'PUBLISHED',
    authorId: '550e8400-e29b-41d4-a716-446655440001',
    categoryId: '550e8400-e29b-41d4-a716-446655440002',
    createdAt: new Date('2026-04-26T10:08:50.372Z'),
    updatedAt: new Date('2026-04-26T10:08:50.372Z'),
    tags: [],
  };
  const mockTAg = {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'typescript',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        {
          provide: PrismaService,
          useValue: {
            article: {
              findMany: vi.fn(),
              findUnique: vi.fn(),
              create: vi.fn(),
              update: vi.fn(),
              delete: vi.fn(),
            },
            tag: {
              findUnique: vi.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  describe('get articles', async () => {
    it('should return a list of articles', async () => {
      const mockArticles = [mockArticle, mockArticle];
      vi.mocked(prismaService.article.findMany).mockResolvedValue(
        mockArticles as never,
      );
      const result = await service.getArticles();
      expect(result).toEqual(mockArticles);
      expect(prismaService.article.findMany).toHaveBeenCalledTimes(1);
      expect(prismaService.article.findMany).toHaveBeenCalledWith();
    });
    it('should return empty array if no articles exist', async () => {
      vi.mocked(prismaService.article.findMany).mockResolvedValue([] as never);
      const result = await service.getArticles();
      expect(result).toEqual([]);
      expect(prismaService.article.findMany).toHaveBeenCalledTimes(1);
      expect(prismaService.article.findMany).toHaveBeenCalledWith();
    });
  });
  describe('add articles', async () => {
    it('should return article', async () => {
      const createArticleDto: CreateArticleDto = {
        status: Status.DRAFT,
        title: 'Test Article',
        content: 'This is a test article',
        authorId: '550e8400-e29b-41d4-a716-446655440001',
        tags: ['test', 'example'],
        categoryId: '550e8400-e29b-41d4-a716-446655440002',
      };
      vi.mocked(prismaService.article.create).mockResolvedValue(
        mockArticleFromDb as never,
      );
      const result = await service.addArticle(createArticleDto);
      expect(result).toEqual(mockArticle);
      expect(prismaService.article.create).toHaveBeenCalledTimes(1);
      expect(prismaService.article.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            title: createArticleDto.title,
            content: createArticleDto.content,
            status: createArticleDto.status,
          }),
          include: {
            tags: true,
          },
        }),
      );
    });
  });
});
