import 'reflect-metadata';
import { JsonController, Post, Put, Delete, Param, Body, Authorized } from 'routing-controllers';
import { PrismaClient } from '@prisma/client';
import { Utils } from '../utils';

@JsonController('/v1')
export class ProductController {  

  @Authorized('user')
  @Post('/categories/:categoryId/products')
  public async createProduct(@Body() productData: any, @Param('categoryId') categoryId: string) {
    
    const prisma = new PrismaClient();
    const product = await prisma.product.create({
      data: {
        ...productData,
        id: Utils.generateUUID(),
        categoryId: categoryId
      }
    });
    prisma.$disconnect();
    return product;
  }

  @Authorized('user')
  @Put('/categories/:categoryId/products/:id')
  public async updateProduct(@Param('id') id: string, @Body() productData: any) {
    const prisma = new PrismaClient();
    const product = await prisma.product.update({
      where: {
        id: id
      },
      data: productData
    });
    prisma.$disconnect();

    return product;
  }

  @Authorized('user')
  @Delete('/categories/:categoryId/products/:id')
  public async deleteProduct(@Param('id') id: string) {
    const prisma = new PrismaClient();
    const product = await prisma.product.delete({
      where: {
        id: id
      }
    });
    prisma.$disconnect();

    return product;
  }
}