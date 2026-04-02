import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Category } from '../../core/types/data.types';
import { randomUUID } from 'node:crypto';
import { isUUID } from 'class-validator';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  categories: Category[] = [
    {
      id: randomUUID(),
      name: 'skfhlskjf sdjhflkdsj',
      description: 'mnfnd sdfjkl;sdj s.;dlkflds',
    },
    {
      id: randomUUID(),
      name: 'skfhlskjf sdjhflkdsj',
      description: 'mnfnd sdfjkl;sdj s.;dlkflds',
    },
    {
      id: randomUUID(),
      name: 'skfhlskjf sdjhflkdsj',
      description: 'mnfnd sdfjkl;sdj s.;dlkflds',
    },
  ];

  getAllCategories() {
    return this.categories;
  }

  getCategory(id: string) {
    if (!isUUID(id)) throw new BadRequestException('id must be UUID');
    const category = this.categories.find((category) => category.id === id);
    if (!category) throw new NotFoundException('category not found');
    return category;
  }
  createCategory(category: CreateCategoryDto) {
    const newCategory = {
      ...category,
      id: randomUUID(),
    };
    this.categories.push(newCategory);
    return newCategory;
  }
  updateCategory(id: string, dto: UpdateCategoryDto) {
    if (!isUUID(id)) throw new BadRequestException('id must be UUID');
    const category = this.categories.find((category) => category.id === id);
    if (!category) throw new NotFoundException('category not found');
    const updateCategory = {
      ...category,
      ...dto,
    };
    this.categories = this.categories.map((item) => {
      if (item.id === id) return updateCategory;
      return item;
    });
    return updateCategory;
  }
  deleteCategory(id: string) {
    if (!isUUID(id)) throw new BadRequestException('id must be UUID');
    const category = this.categories.find((category) => category.id === id);
    if (!category) throw new NotFoundException('category not found');
    return this.categories.filter((category) => category.id !== id);
  }
}
