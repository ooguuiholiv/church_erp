import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Category, TransactionType, Prisma } from '@prisma/client';

@Injectable()
export class CategoriesService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedDefaults();
  }

  async seedDefaults() {
    const count = await this.prisma.category.count();
    if (count === 0) {
      const defaults = [
        // Receitas
        { name: 'Dízimo', type: TransactionType.RECEITA },
        { name: 'Oferta', type: TransactionType.RECEITA },
        { name: 'Doação', type: TransactionType.RECEITA },
        { name: 'Venda de Materiais', type: TransactionType.RECEITA },
        // Despesas
        { name: 'Aluguel', type: TransactionType.DESPESA },
        { name: 'Água/Luz/Internet', type: TransactionType.DESPESA },
        { name: 'Ministérios', type: TransactionType.DESPESA },
        { name: 'Manutenção', type: TransactionType.DESPESA },
        { name: 'Salários', type: TransactionType.DESPESA },
        { name: 'Outros', type: TransactionType.DESPESA },
      ];

      await this.prisma.category.createMany({
        data: defaults,
      });
    }
  }

  async findAll() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findByType(type: TransactionType) {
    return this.prisma.category.findMany({
      where: { type },
      orderBy: { name: 'asc' },
    });
  }

  async create(data: Prisma.CategoryCreateInput) {
    return this.prisma.category.create({ data });
  }

  async remove(id: string) {
    return this.prisma.category.delete({ where: { id } });
  }
}
