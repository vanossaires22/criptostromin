import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Check Balance
      const currencyToLock = dto.type === 'BUY' ? 'USDT' : 'BTC';
      const requiredAmount = dto.type === 'BUY' 
        ? dto.price * dto.amount 
        : dto.amount;

      const balance = await tx.balance.findUnique({
        where: { userId_currency: { userId, currency: currencyToLock } }
      });

      if (!balance || balance.amount < requiredAmount) {
        throw new BadRequestException('Insufficient funds');
      }

      // 2. Lock Funds
      await tx.balance.update({
        where: { userId_currency: { userId, currency: currencyToLock } },
        data: { 
          amount: { decrement: requiredAmount },
          locked: { increment: requiredAmount }
        }
      });

      // 3. Create Order
      return tx.order.create({
        data: {
          userId,
          pair: 'BTC/USDT',
          type: dto.type,
          price: dto.price,
          amount: dto.amount,
          status: 'PENDING'
        }
      });
    });
  }
}