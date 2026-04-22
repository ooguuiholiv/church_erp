import { Test, TestingModule } from '@nestjs/testing';
import { FinanceService } from './finance.service';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionType } from '@prisma/client';

describe('FinanceService', () => {
  let service: FinanceService;
  let prisma: PrismaService;

  const mockPrismaService = {
    transaction: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      groupBy: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinanceService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<FinanceService>(FinanceService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('getSummary', () => {
    it('should calculate balance correctly', async () => {
      mockPrismaService.transaction.groupBy.mockResolvedValue([
        { type: TransactionType.RECEITA, _sum: { amount: 1000 } },
        { type: TransactionType.DESPESA, _sum: { amount: 400 } },
      ]);

      const result = await service.getSummary();

      expect(result.totalRevenue).toBe(1000);
      expect(result.totalExpense).toBe(400);
      expect(result.balance).toBe(600);
    });

    it('should handle missing types in summary', async () => {
      mockPrismaService.transaction.groupBy.mockResolvedValue([
        { type: TransactionType.RECEITA, _sum: { amount: 500 } },
      ]);

      const result = await service.getSummary();

      expect(result.totalRevenue).toBe(500);
      expect(result.totalExpense).toBe(0);
      expect(result.balance).toBe(500);
    });
  });
});
