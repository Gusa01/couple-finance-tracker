import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CouplesService } from '../couples/couples.service';
import { SettleBalanceDto } from './dto/settle-balance.dto';

@Injectable()
export class BalanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly couplesService: CouplesService,
  ) {}

  async getBalance(userId: string) {
    const couple = await this.couplesService.getMyCouple(userId);
    const partnerId = couple.user1Id === userId ? couple.user2Id : couple.user1Id;

    const unsettledSplits = await this.prisma.expenseSplit.findMany({
      where: {
        settled: false,
        expense: { coupleId: couple.id },
      },
      include: { expense: true, user: true },
    });

    // Cuánto debe el usuario actual al partner
    const youOwe = unsettledSplits
      .filter((s) => s.userId === userId)
      .reduce((acc, s) => acc + Number(s.amountOwed), 0);

    // Cuánto debe el partner al usuario actual
    const theyOwe = unsettledSplits
      .filter((s) => s.userId === partnerId)
      .reduce((acc, s) => acc + Number(s.amountOwed), 0);

    const round = (n: number) => Math.round(n * 100) / 100;

    return {
      userId,
      partnerUserId: partnerId,
      youOwe: round(youOwe),
      theyOwe: round(theyOwe),
      netBalance: round(theyOwe - youOwe),
      unsettledSplits,
    };
  }

  async getHistory(userId: string) {
    const couple = await this.couplesService.getMyCouple(userId);
    const partnerId = couple.user1Id === userId ? couple.user2Id : couple.user1Id;

    // Últimos 6 meses
    const months: { month: number; year: number }[] = [];
    const now = new Date();
    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ month: d.getMonth() + 1, year: d.getFullYear() });
    }

    const history = await Promise.all(
      months.map(async ({ month, year }) => {
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 1);

        const expenses = await this.prisma.expense.findMany({
          where: { coupleId: couple.id, date: { gte: start, lt: end } },
          include: { splits: true },
        });

        const totalSpent = expenses.reduce((acc, e) => acc + Number(e.amount), 0);
        const youPaid = expenses
          .filter((e) => e.paidById === userId)
          .reduce((acc, e) => acc + Number(e.amount), 0);
        const partnerPaid = expenses
          .filter((e) => e.paidById === partnerId)
          .reduce((acc, e) => acc + Number(e.amount), 0);

        const hasUnsettled = expenses.some((e) =>
          e.splits.some((s) => !s.settled),
        );

        return {
          month,
          year,
          totalSpent: Math.round(totalSpent * 100) / 100,
          youPaid: Math.round(youPaid * 100) / 100,
          partnerPaid: Math.round(partnerPaid * 100) / 100,
          settled: !hasUnsettled,
        };
      }),
    );

    return history;
  }

  async settle(userId: string, dto: SettleBalanceDto) {
    const couple = await this.couplesService.getMyCouple(userId);

    const where = dto.splitIds?.length
      ? { id: { in: dto.splitIds }, expense: { coupleId: couple.id } }
      : { settled: false, expense: { coupleId: couple.id } };

    const { count } = await this.prisma.expenseSplit.updateMany({
      where,
      data: { settled: true },
    });

    return { settled: count };
  }
}
