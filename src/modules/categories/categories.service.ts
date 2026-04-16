import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}
  async getAllCategories() {
    return this.prismaService.category.findMany();
  }

  async getCategory(id: string) {
    if (!isUUID(id)) throw new BadRequestException('id must be UUID');
    const category = await this.prismaService.category.findUnique({
      where: {
        id,
      },
    });
    if (!category) throw new NotFoundException('category not found');
    return category;
  }
  async createCategory(category: CreateCategoryDto) {
    return this.prismaService.category.create({
      data: {
        ...category,
      },
    });
  }
  async updateCategory(id: string, dto: UpdateCategoryDto) {
    if (!isUUID(id)) throw new BadRequestException('id must be UUID');
    try {
      return await this.prismaService.category.update({
        where: { id },
        data: {
          ...dto,
        },
      });
    } catch (error) {
      // Обработка ошибки "Record not found" от Prisma
      if (error.code === 'P2025') {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
      throw error;
    }
  }
  async deleteCategory(id: string) {
    if (!isUUID(id)) throw new BadRequestException('id must be UUID');
    try {
      await this.prismaService.category.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      // Обработка ошибки "Record not found" от Prisma
      if (error.code === 'P2025') {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
      throw error;
    }
  }
}
