
import React, { useState, useEffect } from 'react';
import { AppView, Account, Transaction, Category, SavingGoal, Debt } from './types';
import HomeView from './components/views/HomeView';
import TransactionsView from './components/views/TransactionsView';
import CategoryView from './components/views/CategoryView';
import AnalyticsView from './components/views/AnalyticsView';
import VoiceInputView from './components/views/VoiceInputView';
import ManageAccountsView from './components/views/ManageAccountsView';
import CreateItemView from './components/views/CreateItemView';
import AddTransactionWidget from './components/modals/AddTransactionWidget';
import TransferWidget from './components/modals/TransferWidget';
import BottomNav from './components/layout/BottomNav';

const STORAGE_KEY = 'wealthflow_db_v2';

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Housing', icon: 'home', color: 'blue', limit: 80000 },
  { id: '2', name: 'Food & Dining', icon: 'restaurant', color: 'orange', limit: 50000 },
  { id: '3', name: 'Transport', icon: 'commute', color: 'purple', limit: 20000 },
  { id: '4', name: 'Entertainment', icon: 'movie', color: 'pink' },
  { id: '5', name: 'Subscriptions', icon: 'subscriptions', color: 'red' },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [savings, setSavings] = useState<SavingGoal[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);

  // Load data
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setAccounts(parsed.accounts || []);
        setTransactions(parsed.transactions || []);
        setCategories(parsed.categories || DEFAULT_CATEGORIES);
        setSavings(parsed.savings || []);
        setDebts(parsed.debts || []);
      } catch (e) {
        console.error("Failed to parse storage", e);
      }
    } else {
      // Seeds
      setAccounts([
        { id: 'a1', name: 'Santander Debit', type: 'Debit', currency: 'ARS', balance: 150000, lastDigits: '4242', color: 'blue', icon: 'account_balance' },
        { id: 'a2', name: 'Cash Wallet', type: 'Cash', currency: 'ARS', balance: 12000, color: 'emerald', icon: 'payments' },
        { id: 'a3', name: 'Visa Gold', type: 'Credit', currency: 'ARS', balance: -45000, color: 'indigo', icon: 'credit_card' }
      ]);
      setSavings([
        { id: 's1', name: 'Trip to Japan', targetAmount: 5000, currentAmount: 1200, currency: 'USD', color: 'indigo', icon: 'flight' }
      ]);
    }
  }, []);

  // Save data
  useEffect(() => {
    if (accounts.length > 0 || transactions.length > 0 || categories.length > 0) {
      const data = { accounts, transactions, categories, savings, debts };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [accounts, transactions, categories, savings, debts]);

  const handleAddTransaction = (tx: Transaction) => {
    setTransactions(prev => [tx, ...prev]);
    setAccounts(prev => prev.map(acc => {
      if (acc.id === tx.accountId) {
        const diff = tx.type === 'expense' ? -tx.amount : tx.amount;
        return { ...acc, balance: acc.balance + diff };
      }
      return acc;
    }));
    setIsAddingTransaction(false);
  };

  const handleDeleteAccount = (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this account? Transactions related to this account will remain in history but the account itself will be removed.");
    if (confirmed) {
      setAccounts(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleDeleteCategory = (id: string) => {
    const confirmed = window.confirm("Delete this category?");
    if (confirmed) {
      setCategories(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleEditCategory = (updatedCat: Category) => {
    setCategories(prev => prev.map(c => c.id === updatedCat.id ? updatedCat : c));
  };

  const handleTransfer = (sourceId: string, targetId: string, targetType: 'account' | 'saving' | 'debt', amount: number) => {
    const sourceAccount = accounts.find(a => a.id === sourceId);
    if (!sourceAccount) return;

    const tx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      accountId: sourceId,
      amount: amount,
      currency: sourceAccount.currency,
      category: 'Transfer',
      merchant: `Transfer: ${sourceAccount.name} -> ${targetId}`,
      time: Date.now(),
      type: 'transfer'
    };
    setTransactions(prev => [tx, ...prev]);

    setAccounts(prev => prev.map(acc => 
      acc.id === sourceId ? { ...acc, balance: acc.balance - amount } : acc
    ));

    if (targetType === 'account') {
      setAccounts(prev => prev.map(acc => 
        acc.id === targetId ? { ...acc, balance: acc.balance + amount } : acc
      ));
    } else if (targetType === 'saving') {
      setSavings(prev => prev.map(s => 
        s.id === targetId ? { ...s, currentAmount: s.currentAmount + amount } : s
      ));
    } else if (targetType === 'debt') {
      setDebts(prev => prev.map(d => 
        d.id === targetId ? { ...d, remainingAmount: Math.max(0, d.remainingAmount - amount) } : d
      ));
    }

    setIsTransferring(false);
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.HOME:
        return (
          <HomeView 
            accounts={accounts} 
            savings={savings}
            debts={debts}
            transactions={transactions}
            onNavigate={setCurrentView}
            onOpenTransfer={() => setIsTransferring(true)}
          />
        );
      case AppView.ANALYTICS:
        return <AnalyticsView transactions={transactions} categories={categories} />;
      case AppView.TRANSACTIONS:
        return <TransactionsView transactions={transactions} accounts={accounts} />;
      case AppView.CATEGORIES:
        return (
          <CategoryView 
            categories={categories} 
            onAddCategory={(c) => setCategories(p => [...p, c])} 
            onDeleteCategory={handleDeleteCategory}
            onEditCategory={handleEditCategory}
          />
        );
      case AppView.MANAGE_ACCOUNTS:
        return (
          <ManageAccountsView 
            accounts={accounts} 
            savings={savings} 
            debts={debts} 
            onDeleteAccount={handleDeleteAccount}
            onBack={() => setCurrentView(AppView.HOME)}
            onAdd={() => setCurrentView(AppView.CREATE_ACCOUNT)}
            onAddSaving={() => setCurrentView(AppView.CREATE_SAVING)}
            onAddDebt={() => setCurrentView(AppView.CREATE_DEBT)}
          />
        );
      case AppView.CREATE_ACCOUNT:
        return <CreateItemView type="account" onBack={() => setCurrentView(AppView.MANAGE_ACCOUNTS)} onSave={(item) => { setAccounts(p => [...p, item as Account]); setCurrentView(AppView.MANAGE_ACCOUNTS); }} />;
      case AppView.CREATE_SAVING:
        return <CreateItemView type="saving" onBack={() => setCurrentView(AppView.MANAGE_ACCOUNTS)} onSave={(item) => { setSavings(p => [...p, item as SavingGoal]); setCurrentView(AppView.MANAGE_ACCOUNTS); }} />;
      case AppView.CREATE_DEBT:
        return <CreateItemView type="debt" onBack={() => setCurrentView(AppView.MANAGE_ACCOUNTS)} onSave={(item) => { setDebts(p => [...p, item as Debt]); setCurrentView(AppView.MANAGE_ACCOUNTS); }} />;
      case AppView.VOICE_INPUT:
        return <VoiceInputView accounts={accounts} categories={categories} onBack={() => setCurrentView(AppView.HOME)} onConfirm={handleAddTransaction} />;
      default:
        return <HomeView accounts={accounts} transactions={transactions} savings={savings} debts={debts} onNavigate={setCurrentView} onOpenTransfer={() => setIsTransferring(true)} />;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto relative overflow-hidden bg-background-dark font-display text-white">
      <main className="flex-1 overflow-y-auto hide-scrollbar pb-24">
        {renderView()}
      </main>

      <BottomNav 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        onQuickAdd={() => setIsAddingTransaction(true)} 
      />

      {isAddingTransaction && (
        <AddTransactionWidget 
          isOpen={isAddingTransaction}
          onClose={() => setIsAddingTransaction(false)}
          accounts={accounts}
          categories={categories}
          onSave={handleAddTransaction}
        />
      )}

      {isTransferring && (
        <TransferWidget 
          isOpen={isTransferring}
          onClose={() => setIsTransferring(false)}
          accounts={accounts}
          savings={savings}
          debts={debts}
          onTransfer={handleTransfer}
        />
      )}
    </div>
  );
};

export default App;
