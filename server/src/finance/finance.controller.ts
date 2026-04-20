import { Controller, Get, Post, Body, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { Prisma, TransactionType } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('finance')
@UseGuards(JwtAuthGuard)
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Post()
  create(@Body() data: Prisma.TransactionCreateInput) {
    return this.financeService.create(data);
  }

  @Get()
  findAll(
    @Query('type') type?: TransactionType,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.financeService.findAll({
      where: {
        type,
        categoryId,
      },
    });
  }

  @Get('summary')
  getSummary() {
    return this.financeService.getSummary();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.financeService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.financeService.remove(id);
  }
}
