import {
  Body,
  Controller,
  Delete,
  Get,
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
    res.status(200).json(this.categoriesService.getAllCategories());
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
  deleteCategory(@Res() res: Response, @Param('id') id: string) {
    res.status(204).json(this.categoriesService.deleteCategory(id));
  }
}
