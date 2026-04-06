import { ExpenseSplit } from '../types/expense';

export interface BalanceResponseDto {
  userId: string;
  partnerUserId: string;
  youOwe: number;
  theyOwe: number;
  netBalance: number;
  unsettledSplits: ExpenseSplit[];
}

export interface BalanceHistoryItemDto {
  month: number;
  year: number;
  totalSpent: number;
  youPaid: number;
  partnerPaid: number;
  settled: boolean;
}

export interface SettleBalanceDto {
  splitIds?: string[];
}
