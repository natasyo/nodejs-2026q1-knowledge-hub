import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Response } from 'express';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  @Get()
  async getCategories(@Res() res: Response) {
    const result = await this.categoriesService.getAllCategories();
    res.status(200).json(result);
  }

  @Get(':id')
  async getCategory(@Res() res: Response, @Param('id') id: string) {
    res.status(200).json(await this.categoriesService.getCategory(id));
  }

  @Post()
  async createCategory(
    @Res() res: Response,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    res
      .status(201)
      .json(await this.categoriesService.createCategory(createCategoryDto));
  }

  @Put(':id')
  async updateCategory(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    res.status(200).json(await this.categoriesService.updateCategory(id, dto));
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteCategory(@Param('id') id: string) {
    await this.categoriesService.deleteCategory(id);
    return;
  }
}
