import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Transaction, TransactionType, Prisma } from '@prisma/client';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateTransactionDto): Promise<Transaction> {
    const { categoryId, date, ...rest } = data;
    return this.prisma.transaction.create({
      data: {
        ...rest,
        category: { connect: { id: categoryId } },
        date: new Date(date),
      },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TransactionWhereUniqueInput;
    where?: Prisma.TransactionWhereInput;
    orderBy?: Prisma.TransactionOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.transaction.findMany({
      skip,
      take,
      cursor,
      where,
      include: {
        category: true,
      },
      orderBy: orderBy || { date: 'desc' },
    });
  }

  async findOne(id: string): Promise<Transaction | null> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
    if (!transaction) throw new NotFoundException('Transação não encontrada');
    return transaction;
  }

  async getSummary() {
    const totals = await this.prisma.transaction.groupBy({
      by: ['type'],
      _sum: {
        amount: true,
      },
    });

    const revenue = totals.find((t) => t.type === TransactionType.RECEITA)?._sum.amount || 0;
    const expense = totals.find((t) => t.type === TransactionType.DESPESA)?._sum.amount || 0;
    const balance = Number(revenue) - Number(expense);

    return {
      totalRevenue: Number(revenue),
      totalExpense: Number(expense),
      balance,
    };
  }

  async update(id: string, data: UpdateTransactionDto): Promise<Transaction> {
    const { categoryId, date, ...rest } = data;
    return this.prisma.transaction.update({
      where: { id },
      data: {
        ...rest,
        category: categoryId ? { connect: { id: categoryId } } : undefined,
        date: date ? new Date(date) : undefined,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.transaction.delete({ where: { id } });
  }
}
