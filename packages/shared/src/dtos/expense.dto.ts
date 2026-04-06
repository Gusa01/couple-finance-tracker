import { SplitType } from '../types/enums';

export interface CreateExpenseDto {
  amount: number;
  categoryId: string;
  description: string;
  date: string;
  splitType: SplitType;
  /** Requerido cuando splitType = CUSTOM. Debe sumar 100. */
  customSplit?: {
    user1Percentage: number;
    user2Percentage: number;
  };
}

export interface UpdateExpenseDto {
  amount?: number;
  categoryId?: string;
  description?: string;
  date?: string;
  splitType?: SplitType;
  customSplit?: {
    user1Percentage: number;
    user2Percentage: number;
  };
}

export interface ExpenseFilters {
  month?: number;
  year?: number;
  categoryId?: string;
  paidById?: string;
  page?: number;
  limit?: number;
}
