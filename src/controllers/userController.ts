import 'reflect-metadata';
import { JsonController, Get, Post, Put, Delete, Param, Body, Authorized } from 'routing-controllers';
import { PrismaClient, User } from '@prisma/client';
import { Utils } from '../utils';

@JsonController('/v1/users')
export class UserController {
  @Authorized('user')
  @Post('/')
  async createUser(@Body() userData: any) {
    const prisma = new PrismaClient();
    const user = await prisma.user.create({
      data: {
        ...userData,
        id: Utils.generateUUID()
      }
    });
    prisma.$disconnect();
    return user;
  }
  @Authorized('user')
  @Get('/')
  async getUsers() {
    const prisma = new PrismaClient();
    const users:User[] = await prisma.user.findMany();
    prisma.$disconnect();

    const safeUsers: Omit<User, 'hashedPassword'>[] = users.map(({ hashedPassword, ...user }) => user);
    return safeUsers;
  }
  @Authorized('user')
  @Get('/:id')
  async getUserById(@Param('id') id: string) {
    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({
      where: {
        id: id
      }
    });
    prisma.$disconnect();

    return (user as Omit<User, 'hashedPassword'>);
  }
  @Authorized('user')
  @Put('/:id')
  async updateUser(@Param('id') id: string, @Body() userData: any) {
    const prisma = new PrismaClient();
    const user = await prisma.user.update({
      where: {
        id: id
      },
      data: userData
    });
    prisma.$disconnect();
    return user;
  }
  @Authorized('user')
  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    const prisma = new PrismaClient();
    const user = await prisma.user.delete({
      where: {
        id: id
      }
    });
    prisma.$disconnect();
    return user;
  }
}