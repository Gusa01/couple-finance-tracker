import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, SplitType, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CouplesService } from '../couples/couples.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpenseFiltersDto } from './dto/expense-filters.dto';

const EXPENSE_INCLUDE = {
  paidBy: true,
  category: true,
  splits: { include: { user: true } },
  receipts: true,
} as const;

@Injectable()
export class ExpensesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly couplesService: CouplesService,
  ) {}

  async findAll(userId: string, filters: ExpenseFiltersDto) {
    const couple = await this.couplesService.getMyCouple(userId);
    const { month, year, categoryId, paidById, limit = 20, page = 0 } = filters;

    const where: Prisma.ExpenseWhereInput = { coupleId: couple.id };

    if (month !== undefined && year !== undefined) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);
      where.date = { gte: start, lt: end };
    } else if (year !== undefined) {
      const start = new Date(year, 0, 1);
      const end = new Date(year + 1, 0, 1);
      where.date = { gte: start, lt: end };
    }

    if (categoryId) where.categoryId = categoryId;
    if (paidById) where.paidById = paidById;

    const [items, total] = await Promise.all([
      this.prisma.expense.findMany({
        where,
        include: EXPENSE_INCLUDE,
        orderBy: { date: 'desc' },
        take: limit,
        skip: page * limit,
      }),
      this.prisma.expense.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  async findOne(id: string, userId: string) {
    const expense = await this.prisma.expense.findUnique({
      where: { id },
      include: EXPENSE_INCLUDE,
    });

    if (!expense) throw new NotFoundException('Gasto no encontrado');
    await this.assertBelongsToCouple(expense.coupleId, userId);
    return expense;
  }

  async create(userId: string, dto: CreateExpenseDto) {
    const couple = await this.couplesService.getMyCouple(userId);

    await this.assertCategoryBelongsToCouple(dto.categoryId, couple.id);

    if (dto.splitType === SplitType.CUSTOM) {
      const { user1Percentage, user2Percentage } = dto.customSplit!;
      if (user1Percentage + user2Percentage !== 100) {
        throw new BadRequestException('Los porcentajes del split deben sumar 100');
      }
    }

    const partnerId = couple.user1Id === userId ? couple.user2Id : couple.user1Id;
    const splits = this.calculateSplits(dto.amount, dto.splitType, userId, partnerId, dto.customSplit);

    return this.prisma.expense.create({
      data: {
        coupleId: couple.id,
        paidById: userId,
        categoryId: dto.categoryId,
        amount: dto.amount,
        description: dto.description,
        date: new Date(dto.date),
        splitType: dto.splitType,
        splits: { create: splits },
      },
      include: EXPENSE_INCLUDE,
    });
  }

  async update(id: string, userId: string, dto: UpdateExpenseDto) {
    const expense = await this.findOne(id, userId);

    if (expense.paidById !== userId) {
      throw new ForbiddenException('Solo el creador puede editar este gasto');
    }

    const couple = await this.couplesService.getMyCouple(userId);

    if (dto.categoryId) {
      await this.assertCategoryBelongsToCouple(dto.categoryId, couple.id);
    }

    const partnerId = couple.user1Id === userId ? couple.user2Id : couple.user1Id;
    const newAmount = dto.amount ?? Number(expense.amount);
    const newSplitType = dto.splitType ?? expense.splitType;
    const newCustomSplit = dto.customSplit;

    if (newSplitType === SplitType.CUSTOM && newCustomSplit) {
      const { user1Percentage, user2Percentage } = newCustomSplit;
      if (user1Percentage + user2Percentage !== 100) {
        throw new BadRequestException('Los porcentajes del split deben sumar 100');
      }
    }

    const splits = this.calculateSplits(newAmount, newSplitType, userId, partnerId, newCustomSplit);

    return this.prisma.$transaction(async (tx) => {
      await tx.expenseSplit.deleteMany({ where: { expenseId: id } });
      return tx.expense.update({
        where: { id },
        data: {
          amount: newAmount,
          categoryId: dto.categoryId,
          description: dto.description,
          date: dto.date ? new Date(dto.date) : undefined,
          splitType: newSplitType,
          splits: { create: splits },
        },
        include: EXPENSE_INCLUDE,
      });
    });
  }

  async remove(id: string, userId: string) {
    const expense = await this.findOne(id, userId);

    if (expense.paidById !== userId) {
      throw new ForbiddenException('Solo el creador puede eliminar este gasto');
    }

    await this.prisma.expense.delete({ where: { id } });
    return { deleted: true };
  }

  // --- Helpers ---

  private calculateSplits(
    amount: number,
    splitType: SplitType,
    payerId: string,
    partnerId: string,
    customSplit?: { user1Percentage: number; user2Percentage: number },
  ) {
    const round = (n: number) => Math.round(n * 100) / 100;

    switch (splitType) {
      case SplitType.EQUAL:
        return [
          { userId: payerId,   amountOwed: 0 },
          { userId: partnerId, amountOwed: round(amount / 2) },
        ];
      case SplitType.CUSTOM: {
        const { user2Percentage } = customSplit!;
        return [
          { userId: payerId,   amountOwed: 0 },
          { userId: partnerId, amountOwed: round(amount * (user2Percentage / 100)) },
        ];
      }
      case SplitType.FULL:
        return [
          { userId: payerId,   amountOwed: 0 },
          { userId: partnerId, amountOwed: round(amount) },
        ];
    }
  }

  private async assertBelongsToCouple(coupleId: string, userId: string) {
    const couple = await this.prisma.couple.findFirst({
      where: { id: coupleId, OR: [{ user1Id: userId }, { user2Id: userId }] },
    });
    if (!couple) throw new ForbiddenException('No tenés acceso a este gasto');
  }

  private async assertCategoryBelongsToCouple(categoryId: string, coupleId: string) {
    const category = await this.prisma.category.findFirst({
      where: { id: categoryId, coupleId },
    });
    if (!category) {
      throw new BadRequestException('La categoría no pertenece a esta pareja');
    }
  }
}
