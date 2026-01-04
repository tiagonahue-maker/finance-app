
import React, { useState, useEffect } from 'react';
import { Account, AccountType, Currency } from '../../types';

interface AddAccountViewProps {
  initialAccount?: Account;
  onBack: () => void;
  onSave: (account: Account) => void;
  onDelete: (id: string) => void;
}

const AddAccountView: React.FC<AddAccountViewProps> = ({ initialAccount, onBack, onSave, onDelete }) => {
  const [type, setType] = useState<AccountType>('Debit');
  const [currency, setCurrency] = useState<Currency>('ARS');
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [limit, setLimit] = useState('');
  const [lastDigits, setLastDigits] = useState('');
  const [closingDay, setClosingDay] = useState('15');
  const [dueDay, setDueDay] = useState('5');
  const [selectedColor, setSelectedColor] = useState('blue');

  useEffect(() => {
    if (initialAccount) {
      setType(initialAccount.type);
      setCurrency(initialAccount.currency || 'ARS');
      setName(initialAccount.name);
      setBalance(Math.abs(initialAccount.balance).toString());
      setTargetAmount(initialAccount.targetAmount?.toString() || '');
      setLimit(initialAccount.limit?.toString() || '');
      setLastDigits(initialAccount.lastDigits || '');
      setClosingDay(initialAccount.closingDay?.toString() || '15');
      setDueDay(initialAccount.dueDay?.toString() || '5');
      setSelectedColor(initialAccount.color);
    }
  }, [initialAccount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let icon = 'account_balance';
    switch(type) {
      case 'Credit': icon = 'credit_card'; break;
      case 'Cash': icon = 'payments'; break;
      case 'Savings': icon = 'savings'; break;
      case 'Loan': icon = 'directions_car'; break;
      default: icon = 'account_balance';
    }

    const finalBalance = (type === 'Credit' || type === 'Loan') ? -Math.abs(parseFloat(balance)) : parseFloat(balance);

    const newAccount: Account = {
      id: initialAccount?.id || Math.random().toString(36).substr(2, 9),
      name: name || `New ${type}`,
      type,
      currency,
      balance: finalBalance || 0,
      lastDigits: lastDigits || undefined,
      color: selectedColor,
      icon,
      targetAmount: (type === 'Loan' || type === 'Savings') ? parseFloat(targetAmount) : undefined,
      ...(type === 'Credit' && {
        limit: parseFloat(limit) || 0,
        closingDay: parseInt(closingDay),
        dueDay: parseInt(dueDay),
      })
    };
    onSave(newAccount);
  };

  const showLastDigits = ['Debit', 'Credit'].includes(type);
  const showGoalDebt = ['Savings', 'Loan'].includes(type);

  return (
    <div className="flex flex-col bg-background-dark min-h-screen">
      <header className="sticky top-0 z-50 flex items-center bg-background-dark/95 backdrop-blur-md px-4 py-3 justify-between">
        <button onClick={onBack} className="size-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors text-white">
          <span className="material-symbols-outlined text-white">close</span>
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-10 text-white tracking-tight">
          {initialAccount ? 'Edit Account' : 'New Account'}
        </h2>
      </header>

      <form onSubmit={handleSubmit} className="px-6 py-6 space-y-8 pb-32 overflow-y-auto">
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Type</label>
          <div className="flex h-11 w-full items-center justify-center rounded-xl bg-neutral-900 p-1">
            {(['Debit', 'Credit', 'Cash', 'Savings', 'Loan'] as AccountType[]).map((t) => (
              <button 
                key={t} 
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 h-full rounded-lg text-[10px] font-bold transition-all ${type === t ? 'bg-surface-dark-high text-white shadow-sm' : 'text-neutral-500'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Currency</label>
          <div className="flex h-11 w-full items-center justify-center rounded-xl bg-neutral-900 p-1">
            {(['ARS', 'USD'] as Currency[]).map((c) => (
              <button 
                key={c} 
                type="button"
                onClick={() => setCurrency(c)}
                className={`flex-1 h-full rounded-lg text-xs font-bold transition-all ${currency === c ? 'bg-primary text-black' : 'text-neutral-500'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-400 mb-2 ml-1 uppercase tracking-tight">Name</label>
            <input 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Daily Account"
              className="w-full bg-surface-dark border border-white/5 rounded-2xl px-5 py-4 text-white font-bold focus:ring-1 focus:ring-primary/50 placeholder-neutral-700 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2 ml-1 uppercase tracking-tight">
                  { (type === 'Credit' || type === 'Loan') ? 'Debt' : 'Balance' }
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-bold uppercase">{currency}</span>
                  <input 
                    type="number"
                    step="0.01"
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-surface-dark border border-white/5 rounded-2xl pl-16 pr-4 py-4 text-white font-bold focus:ring-1 focus:ring-primary/50 placeholder-neutral-700 transition-all"
                  />
                </div>
             </div>
             
             {showLastDigits && (
               <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-2 ml-1 uppercase tracking-tight">Last 4 Digits</label>
                  <input 
                    maxLength={4}
                    value={lastDigits}
                    onChange={(e) => setLastDigits(e.target.value)}
                    placeholder="8842"
                    className="w-full bg-surface-dark border border-white/5 rounded-2xl px-5 py-4 text-white font-bold focus:ring-1 focus:ring-primary/50 placeholder-neutral-700 transition-all"
                  />
               </div>
             )}

             {showGoalDebt && (
               <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-2 ml-1 uppercase tracking-tight">
                    {type === 'Savings' ? 'Goal Target' : 'Total Amount'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-xs uppercase">{currency}</span>
                    <input 
                      type="number"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(e.target.value)}
                      placeholder="0"
                      className="w-full bg-surface-dark border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white font-bold focus:ring-1 focus:ring-primary/50 placeholder-neutral-700 transition-all"
                    />
                  </div>
               </div>
             )}
          </div>
        </div>

        {initialAccount && (
          <div className="pt-4 border-t border-white/5">
            <button 
              type="button"
              onClick={() => {
                const confirmed = window.confirm('Delete this account forever? All associated balance tracking will be removed.');
                if (confirmed) {
                  onDelete(initialAccount.id);
                }
              }}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-danger font-bold border border-danger/20 bg-danger/5 hover:bg-danger/10 transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-xl">delete</span>
              Delete Account
            </button>
          </div>
        )}
      </form>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-dark via-background-dark to-transparent z-50 max-w-md mx-auto">
        <button 
          onClick={(e) => handleSubmit(e as any)}
          className="w-full bg-primary py-4 rounded-2xl text-black font-extrabold text-lg flex items-center justify-center gap-2 shadow-xl shadow-primary/20 active:scale-95 transition-all"
        >
          {initialAccount ? 'Save Changes' : 'Create Account'}
        </button>
      </div>
    </div>
  );
};

export default AddAccountView;
