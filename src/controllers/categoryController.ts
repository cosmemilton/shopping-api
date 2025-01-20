import 'reflect-metadata';
import { JsonController, Get, Post, Put, Delete, Param, Body, Authorized } from 'routing-controllers';
import { PrismaClient } from '@prisma/client';
import type { Category } from '@prisma/client';
import { Utils } from '../utils';

@JsonController('/v1/categories')
export class CategoryController {
  
  @Authorized('user')
  @Get('/:id')
  public async getCategoryById(@Param('id') id: string) {
    const prisma = new PrismaClient();
    const category = await prisma.category.findFirst({
      where: {
        id: id
      }
    });
    return category;
  }
  @Authorized('user')
  @Post('/')
  public async createCategory(@Body() userData: { name: string, description: string}) {
    (userData as Category).id = Utils.generateUUID();
    const prisma = new PrismaClient();
    const category = await prisma.category.create({
      data: userData as Category
    });
    return category;
  }
  @Authorized('user')
  @Put('/:id')
  public async updateCategory(@Param('id') id: string, @Body() userData:{ name: string, description: string}) {
    const prisma = new PrismaClient();
    const category = await prisma.category.update({
      where: {
        id: id
      },
      data: userData
    });
    return category;
  }
  @Authorized('user')
  @Delete('/:id')
  public async deleteCategory(@Param('id') id: string) {
    const prisma = new PrismaClient();
    const category = await prisma.category.delete({
      where: {
        id: id
      }
    });
    return category;
  }
}