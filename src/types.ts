export type Category = 'ආහාර' | 'ප්‍රවාහන' | 'බිල්පත්' | 'සාප්පු සවාරි' | 'වෙනත්';

export interface Expense {
  id: string;
  amount: number;
  currency?: string;
  category: Category;
  date: string; // ISO string
  notes: string;
  merchant?: string;
  cardEnding?: string;
  bankName?: string;
  balance?: number;
}
