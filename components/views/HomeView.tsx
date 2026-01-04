
import React from 'react';
import { Account, SavingGoal, Debt, Transaction, AppView } from '../../types';

interface HomeViewProps {
  accounts: Account[];
  savings: SavingGoal[];
  debts: Debt[];
  transactions: Transaction[];
  onNavigate: (view: AppView) => void;
  onOpenTransfer: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({ accounts, savings, debts, transactions, onNavigate, onOpenTransfer }) => {
  const totalBalanceARS = accounts.filter(a => a.currency === 'ARS').reduce((s, a) => s + a.balance, 0);
  const totalBalanceUSD = accounts.filter(a => a.currency === 'USD').reduce((s, a) => s + a.balance, 0);

  return (
    <div className="px-6 pt-10 flex flex-col gap-10 animate-in fade-in duration-500">
      {/* Header Summary */}
      <div className="flex flex-col gap-1">
        <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Consolidated Liquidity</p>
        <div className="flex flex-col">
          <h1 className="text-4xl font-black tracking-tighter">{totalBalanceARS.toLocaleString()} <span className="text-primary text-xl uppercase">ARS</span></h1>
          {totalBalanceUSD > 0 && (
             <h2 className="text-2xl font-bold text-neutral-400">{totalBalanceUSD.toLocaleString()} <span className="text-sm uppercase">USD</span></h2>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <button 
          onClick={onOpenTransfer}
          className="flex-1 bg-neutral-900 border border-white/5 py-4 rounded-[28px] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg"
        >
          <span className="material-symbols-outlined text-primary text-xl">sync_alt</span>
          <span className="text-[10px] font-black uppercase tracking-widest">Transfer</span>
        </button>
        <button 
          onClick={() => onNavigate(AppView.ANALYTICS)}
          className="flex-1 bg-neutral-900 border border-white/5 py-4 rounded-[28px] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg"
        >
          <span className="material-symbols-outlined text-warning text-xl">monitoring</span>
          <span className="text-[10px] font-black uppercase tracking-widest">Analytics</span>
        </button>
      </div>

      {/* Main Accounts Quick View */}
      <section>
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-sm font-black uppercase tracking-widest text-neutral-400">Your Accounts</h3>
          <button 
            onClick={() => onNavigate(AppView.MANAGE_ACCOUNTS)}
            className="text-primary text-[10px] font-black uppercase tracking-widest border-b border-primary/30 pb-0.5"
          >
            Manage
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {accounts.slice(0, 3).map(acc => (
            <div key={acc.id} className="group p-5 bg-neutral-900/40 rounded-[32px] border border-white/5 flex items-center justify-between hover:border-primary/20 transition-all cursor-pointer shadow-lg shadow-black/5">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/5">
                  <span className="material-symbols-outlined text-xl">{acc.icon}</span>
                </div>
                <div>
                  <p className="font-black text-sm text-white uppercase">{acc.name}</p>
                  <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">{acc.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-black text-base uppercase ${acc.balance < 0 ? 'text-danger' : 'text-white'}`}>
                  {acc.balance.toLocaleString()} <span className="text-[10px] uppercase">{acc.currency}</span>
                </p>
              </div>
            </div>
          ))}
          {accounts.length === 0 && <p className="text-center py-4 text-neutral-600 text-xs italic">No accounts found. Add one from Manage.</p>}
        </div>
      </section>

      {/* Savings Progress */}
      <section>
        <h3 className="text-sm font-black uppercase tracking-widest text-neutral-400 mb-4 px-1">Savings Progress</h3>
        <div className="grid grid-cols-2 gap-4">
          {savings.map(s => (
            <div key={s.id} className="p-5 bg-neutral-900 border border-white/5 rounded-[32px] flex flex-col gap-3 shadow-sm">
              <span className="material-symbols-outlined text-primary">{s.icon}</span>
              <p className="font-black text-[10px] uppercase tracking-tight text-white">{s.name}</p>
              <div className="flex justify-between items-end">
                <p className="text-sm font-black">{(s.currentAmount / s.targetAmount * 100).toFixed(0)}%</p>
                <p className="text-[8px] font-bold text-neutral-500 uppercase">{s.currency}</p>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-primary" style={{ width: `${(s.currentAmount / s.targetAmount) * 100}%` }}></div>
              </div>
            </div>
          ))}
          <div 
            onClick={() => onNavigate(AppView.MANAGE_ACCOUNTS)}
            className="p-5 bg-neutral-900/10 rounded-[32px] border border-dashed border-white/5 flex flex-col items-center justify-center min-h-[120px] cursor-pointer hover:bg-white/5 transition-all"
          >
             <span className="material-symbols-outlined text-neutral-700 mb-1">add_task</span>
             <p className="text-[9px] font-black uppercase text-neutral-700 tracking-widest">New Goal</p>
          </div>
        </div>
      </section>

      {/* Activity */}
      <section className="pb-12">
        <h3 className="text-sm font-black uppercase tracking-widest text-neutral-400 mb-4 px-1">Activities</h3>
        <div className="flex flex-col gap-2">
          {transactions.slice(0, 4).map(tx => (
            <div key={tx.id} className="flex items-center justify-between p-4 rounded-[28px] bg-neutral-900/20 border border-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className={`size-10 rounded-2xl ${tx.type === 'transfer' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-neutral-800 text-neutral-400'} flex items-center justify-center`}>
                  <span className="material-symbols-outlined text-lg">{tx.type === 'transfer' ? 'sync_alt' : 'payments'}</span>
                </div>
                <div>
                   <p className="font-bold text-xs text-white truncate max-w-[120px]">{tx.merchant}</p>
                   <p className="text-[9px] text-neutral-600 font-black uppercase tracking-widest">{tx.category}</p>
                </div>
              </div>
              <p className={`font-black text-xs ${tx.type === 'transfer' ? 'text-indigo-400' : 'text-white'}`}>
                {tx.type === 'transfer' ? '' : '-'}{tx.amount.toLocaleString()} <span className="text-[8px] uppercase">{tx.currency}</span>
              </p>
            </div>
          ))}
          {transactions.length === 0 && <p className="text-center py-6 text-neutral-600 text-[10px] font-black uppercase italic tracking-widest">No activity yet</p>}
        </div>
      </section>
    </div>
  );
};

export default HomeView;
