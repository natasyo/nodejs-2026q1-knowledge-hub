import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { isUUID } from 'class-validator';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { dataBase } from '../../core/db/db';
import { Order, SortOrderDto } from '../dto/sort-order.dto';
import { sortArray } from '../../core/functions/sort';

@Injectable()
export class CategoriesService {
  getAllCategories(querySort?: SortOrderDto) {
    if (querySort && querySort.sortBy) {
      if (querySort.sortBy) {
        return sortArray(
          dataBase.categories,
          querySort.sortBy,
          querySort.order ?? Order.ASC,
        );
      }
    }
    return dataBase.categories;
  }

  getCategory(id: string) {
    if (!isUUID(id)) throw new BadRequestException('id must be UUID');
    const category = dataBase.categories.find((category) => category.id === id);
    if (!category) throw new NotFoundException('category not found');
    return category;
  }
  createCategory(category: CreateCategoryDto) {
    const newCategory = {
      ...category,
      id: randomUUID(),
    };
    dataBase.categories.push(newCategory);
    return newCategory;
  }
  updateCategory(id: string, dto: UpdateCategoryDto) {
    if (!isUUID(id)) throw new BadRequestException('id must be UUID');
    const category = dataBase.categories.find((category) => category.id === id);
    if (!category) throw new NotFoundException('category not found');
    const updateCategory = {
      ...category,
      ...dto,
    };
    dataBase.categories = dataBase.categories.map((item) => {
      if (item.id === id) return updateCategory;
      return item;
    });
    return updateCategory;
  }
  deleteCategory(id: string) {
    if (!isUUID(id)) throw new BadRequestException('id must be UUID');
    const category = dataBase.categories.find((category) => category.id === id);
    if (!category) throw new NotFoundException('category not found');
    dataBase.articles.forEach((item) => {
      if (item.categoryId === category.id) {
        item.categoryId = null;
      }
    });
    dataBase.categories = dataBase.categories.filter(
      (category: { id: string }) => category.id !== id,
    );

    return;
  }
}
