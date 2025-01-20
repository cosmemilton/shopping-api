import 'reflect-metadata';
import { JsonController, Post, Get, Body, Param, Authorized, CurrentUser, HttpError } from 'routing-controllers';
import { PrismaClient } from '@prisma/client';
import { Utils } from '../utils'
import { AddressType } from '@prisma/client';
import type { Client, ClientAddress, OrderPayment } from '@prisma/client';
import { OrderStatus } from '@prisma/client';
import {validateOrderPayment} from '../validates';
import esitef from '../services/esitef'
import type {Card, TokenizeCardRequest, TokenPaymentBodyRequest} from '../types'
import { AuthorizerType } from '../types'

type ClientData = Omit<Client, 'hashedPassword'> & {password: string, address: ClientAddress};


@JsonController('/v1')
export class ClientController {
  
  @Post('/clients/register')
  async register(@Body() clientData: ClientData) {
    const clientId = Utils.generateUUID();
    const addressId = Utils.generateUUID();

    const prisma = new PrismaClient();

    const [client, clientAddress] = await prisma.$transaction([
        prisma.client.create({
          data: {
            id: clientId,
            username: clientData.username,
            email: clientData.email,
            hashedPassword: Utils.generateMD5(clientData.password),
            document: clientData.document,
            phone: clientData.phone,
            name: clientData.name
          }
        }),
        prisma.clientAddress.create({
            data: {
              id: addressId,
              address: clientData.address.address,
              number: clientData.address.number,
              city: clientData.address.city,
              state: clientData.address.state,
              zipCode: clientData.address.zipCode,
              clientId: clientId,
              complement: clientData.address.complement,
              type: AddressType.BILLING
            }
        })
    ]);

    prisma.$disconnect();
    (client as Client & { address?: ClientAddress } & Omit<Client, 'hashedPassword'> ).address = clientAddress;
    return  client;

  }

  @Get('/products')
  async getProduct() {
    const prisma = new PrismaClient();
    const products = await prisma.product.findMany();
    prisma.$disconnect();
    return products;
  }


  @Get('/products/:id')
  async getProductById(@Param('id') id: string) {
    const prisma = new PrismaClient();
    const product = await prisma.product.findUnique({
      where: {
        id: id
      }
    });
    prisma.$disconnect();
    return product;
  }

  @Get('/categories')
  async listCategories() {
    const prisma = new PrismaClient();
    const categories = await prisma.category.findMany();
    prisma.$disconnect();
    return categories;
  }

  @Get('/categories/:categoryId/products')
  async listProductsByCategory(@Param('categoryId') categoryId: string) {
    const prisma = new PrismaClient();
    const products = await prisma.product.findMany({
      where: {
        categoryId: categoryId
      }
    });
  }

  @Authorized('client')
  @Post('/order/:orderId/payments')
  async processPayment(@CurrentUser() user: any, @Body() paymentData: OrderPayment, @Param('orderId') orderId: string) {

    paymentData.orderId = orderId;
    validateOrderPayment(paymentData)
    const id = Utils.generateUUID();
    const prisma = new PrismaClient();
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
        clientId: user.id
      }
    });
    if (!order) {
      throw new HttpError(400, 'Carrinho de compras não encontrado.');
    }
    const payment = await prisma.orderPayment.create({
      data: {
        ...paymentData,
        orderId: orderId,
        id: id,
      }
    });
    const orderStatus = await prisma.order.update({
      where: {
        id: orderId
      },
      data: {
        status: OrderStatus.APPROVED
      }
    });
    prisma.$disconnect();

    return orderStatus && { payment: payment };
  }

  @Authorized('client')
  @Post('/client/:clientId/paymentmethod')
  async addPaymentMethod(@CurrentUser() user: any, @Param('clientId') clientId:string, @Body() cardData: Card) {
    if (!(clientId === user.id)) {
      throw new HttpError(400, 'Cliente não autorizado.');
    }
    const prisma = new PrismaClient();
    const client = await prisma.client.findUnique({
      where: {
        id: user.id
      }
    });
    if (!client) {
      throw new HttpError(400, 'Cliente não encontrado.');
    }
    const paymentMethodData: TokenizeCardRequest = {
      card: cardData,
      authorizer_id: AuthorizerType.MASTERCARD,
      merchant_usn: Utils.generateRandom12DigitNumber(),
      customer_id: Utils.removeNonNumeric(client.document)
    };
    const tokenizeCard = await esitef.tokenizeCard(paymentMethodData);
    const paymentMethod = await prisma.clientCreditCardToken.create({
      data: {
        clientId: user.id,
        token: tokenizeCard.card.token,
        alias: cardData.alias || '',
        lastDigits: tokenizeCard.card.suffix,
        prefix: tokenizeCard.card.bin,
        id: Utils.generateUUID()
      }
    });
    prisma.$disconnect();
    return paymentMethod;
  }

  @Authorized('client')
  @Get('/client/:clientId/paymentmethod')
  async getPaymentMethod(@CurrentUser() user: any, @Param('clientId') clientId:string) {
    if (!(clientId === user.id)) {
      throw new HttpError(400, 'Cliente não autorizado.');
    }
    const prisma = new PrismaClient();
    const paymentMethods = await prisma.clientCreditCardToken.findMany({
      where: {
        clientId: user.id
      }
    });
    prisma.$disconnect();
    return paymentMethods;
  }

  @Authorized('client')
  @Post('/order/:orderId/paymentswithtoken')
  async processPaymentWithToken(@CurrentUser() user: any, @Body() paymentData: OrderPayment, @Param('orderId') orderId: string) {
    paymentData.orderId = orderId;
    validateOrderPayment(paymentData)
    const id = Utils.generateUUID();
    const prisma = new PrismaClient();
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
        clientId: user.id
      }
    });
    if (!order) {
      throw new HttpError(400, 'Carrinho de compras não encontrado.');
    }
    if (!(paymentData.paymentMethod in ['CREDIT_CARD', 'DEBIT_CARD'])) {
      throw new HttpError(400, 'Método de pagamento inválido.');
    }
    const paymentMethod = await prisma.clientCreditCardToken.findUnique({
      where: {
        id: paymentData.id,
        clientId: user.id
      }
    });

    if (!paymentMethod) {
      throw new HttpError(400, 'Método de pagamento não encontrado.');
    }

    const saleData:TokenPaymentBodyRequest = {      
      amount: Utils.formatMoneySitef(paymentData.total),      
      authorizer_id: AuthorizerType.MASTERCARD.toString(),
      installment_type: '1',
      installments: '1',
      merchant_usn: Utils.generateRandom12DigitNumber(),
      order_id: orderId,
      card: {
        token: paymentMethod.token
      }
     
    };
    const authorization = await esitef.authorizeSaleWithToken(saleData);

    const orderPayment = await prisma.orderPayment.create({
      data: {
        orderId: orderId,
        id: Utils.generateUUID(),
        paymentMethod: paymentData.paymentMethod,
        total: paymentData.total,
       
      }
    });
    const orderStatus = await prisma.order.update({
      where: {
        id: orderId
      },
      data: {
        status: OrderStatus.APPROVED
      }
    });
    prisma.$disconnect();

    return orderStatus && { payment: orderPayment, authorization: authorization };
  }
} 

