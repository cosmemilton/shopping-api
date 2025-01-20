import 'reflect-metadata';
import { JsonController, Post, Body } from 'routing-controllers';
import { PrismaClient } from '@prisma/client';
import { Utils } from '../utils';

@JsonController('/v1/auth')
class AuthController {
  
  @Post('/login/user')
  async loginUser(@Body() userData:any ){
    const hashedPassword = Utils.generateMD5(userData.password);
    const prisma = new PrismaClient();
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: userData.email },
          { username: userData.username }
        ],
        hashedPassword: hashedPassword
      }      
    });

    if (!user) {
      return {message:'Inválido email ou senha'};
    }
    return {jwt: Utils.generateJWt({
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: 'user'
    })}; 
  }

  @Post('/login/client')
  async loginClient(@Body() userData:any) {
    const prisma = new PrismaClient();
    const client = await prisma.client.findFirst({
      where: {
        OR: [
          { email: userData.email },
          { username: userData.username }
        ],
        hashedPassword: Utils.generateMD5(userData.password)
      }
    });

    if (!client) {
      return {message:'Inválido email ou senha'};
    }
    
    return {jwt: Utils.generateJWt({
      id: client.id,
      username: client.username,
      email: client.email,
      name: client.name,
      role: 'client'
    })}; 
  }
  
}

export {AuthController};