import { SplitType } from './enums';
import { User } from './user';
import { Category } from './category';

export interface ExpenseSplit {
  id: string;
  expenseId: string;
  userId: string;
  user: User;
  amountOwed: number;
  settled: boolean;
}

export interface Receipt {
  id: string;
  expenseId: string;
  fileUrl: string;
  uploadedAt: string;
}

export interface Expense {
  id: string;
  coupleId: string;
  paidById: string;
  paidBy: User;
  categoryId: string;
  category: Category;
  amount: number;
  description: string;
  date: string;
  splitType: SplitType;
  splits: ExpenseSplit[];
  receipts: Receipt[];
  createdAt: string;
}
