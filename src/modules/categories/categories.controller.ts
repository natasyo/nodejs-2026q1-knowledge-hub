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
  getCategories(@Res() res: Response) {
    const result = this.categoriesService.getAllCategories();
    res.status(200).json(result);
  }

  @Get(':id')
  getCategory(@Res() res: Response, @Param('id') id: string) {
    res.status(200).json(this.categoriesService.getCategory(id));
  }

  @Post()
  createCategory(
    @Res() res: Response,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    res
      .status(201)
      .json(this.categoriesService.createCategory(createCategoryDto));
  }

  @Put(':id')
  updateCategory(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    res.status(200).json(this.categoriesService.updateCategory(id, dto));
  }

  @Delete(':id')
  @HttpCode(204)
  deleteCategory(@Param('id') id: string) {
    this.categoriesService.deleteCategory(id);
    return;
  }
}
