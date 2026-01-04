
export enum AppView {
  HOME = 'home',
  TRANSACTIONS = 'transactions',
  CATEGORIES = 'categories',
  SAVINGS_DEBTS = 'savings_debts',
  ANALYTICS = 'analytics',
  VOICE_INPUT = 'voice_input',
  MANAGE_ACCOUNTS = 'manage_accounts',
  CREATE_ACCOUNT = 'create_account',
  CREATE_SAVING = 'create_saving',
  CREATE_DEBT = 'create_debt'
}

// Fixed: Added Savings and Loan to AccountType
export type AccountType = 'Debit' | 'Credit' | 'Cash' | 'Savings' | 'Loan';
export type Currency = 'ARS' | 'USD';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  currency: Currency;
  balance: number;
  lastDigits?: string;
  color: string;
  icon: string;
  // Fixed: Added missing properties to Account interface
  targetAmount?: number;
  limit?: number;
  closingDay?: number;
  dueDay?: number;
}

export interface SavingGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  currency: Currency;
  color: string;
  icon: string;
}

export interface Debt {
  id: string;
  name: string;
  totalAmount: number;
  remainingAmount: number;
  currency: Currency;
  color: string;
  icon: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  limit?: number;
  type?: 'expense' | 'income';
}

export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  currency: Currency;
  category: string;
  merchant: string;
  time: number;
  type: 'expense' | 'income' | 'transfer';
  note?: string;
}
