
import React, { useState } from 'react';
import { Transaction, Account } from '../../types';

interface TransactionsViewProps {
  transactions: Transaction[];
  accounts: Account[];
}

const TransactionsView: React.FC<TransactionsViewProps> = ({ transactions, accounts }) => {
  const [search, setSearch] = useState('');

  const filtered = transactions.filter(tx => 
    tx.merchant.toLowerCase().includes(search.toLowerCase()) || 
    tx.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col px-6 pt-10 gap-8 min-h-screen">
      <h2 className="text-2xl font-black tracking-tighter">History</h2>

      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-neutral-500">search</span>
        <input 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search transactions..."
          className="w-full bg-neutral-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-1 focus:ring-primary/50"
        />
      </div>

      <div className="flex flex-col gap-4">
        {filtered.length > 0 ? filtered.map(tx => {
          const acc = accounts.find(a => a.id === tx.accountId);
          return (
            <div key={tx.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-[24px] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-xl bg-neutral-800 flex items-center justify-center text-neutral-400">
                  <span className="material-symbols-outlined">shopping_bag</span>
                </div>
                <div>
                   <p className="font-bold text-sm text-white">{tx.merchant}</p>
                   <p className="text-[10px] text-neutral-500 font-black uppercase">
                     {tx.category} • {acc?.name || 'Account'}
                   </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-sm text-white">
                  -{tx.amount.toLocaleString()} <span className="text-[10px] uppercase">{tx.currency}</span>
                </p>
                <p className="text-[9px] text-neutral-600 font-bold">{new Date(tx.time).toLocaleDateString()}</p>
              </div>
            </div>
          );
        }) : (
           <div className="flex flex-col items-center justify-center py-20 text-neutral-700">
             <span className="material-symbols-outlined text-5xl mb-2">history_toggle_off</span>
             <p className="font-bold text-sm">No transactions found.</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsView;
