
import React from 'react';
import { Account, SavingGoal, Debt } from '../../types';

interface ManageAccountsViewProps {
  accounts: Account[];
  savings: SavingGoal[];
  debts: Debt[];
  onDeleteAccount: (id: string) => void;
  onBack: () => void;
  onAdd: () => void;
  onAddSaving: () => void;
  onAddDebt: () => void;
}

const ManageAccountsView: React.FC<ManageAccountsViewProps> = ({ accounts, savings, debts, onDeleteAccount, onBack, onAdd, onAddSaving, onAddDebt }) => {
  return (
    <div className="px-6 pt-10 flex flex-col gap-10 min-h-screen pb-32 bg-background-dark">
      <header className="flex items-center gap-4">
        <button onClick={onBack} className="size-10 rounded-full bg-neutral-900 flex items-center justify-center text-white border border-white/5">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-2xl font-black tracking-tighter text-white">Manage Portfolio</h2>
      </header>

      {/* Active Accounts Section */}
      <section>
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-sm font-black uppercase tracking-widest text-neutral-500">Your Accounts</h3>
          <button onClick={onAdd} className="size-8 rounded-full bg-primary text-black flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-sm font-black">add</span>
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {accounts.map(acc => (
            <div key={acc.id} className="p-5 bg-neutral-900 border border-white/5 rounded-[32px] flex items-center justify-between transition-all group active:bg-neutral-800">
              <div className="flex items-center gap-4">
                <div className={`size-12 rounded-2xl bg-white/5 text-white flex items-center justify-center border border-white/5`}>
                  <span className="material-symbols-outlined">{acc.icon}</span>
                </div>
                <div>
                  <p className="font-black text-sm text-white uppercase">{acc.name}</p>
                  <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest">{acc.type} • {acc.currency}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className={`font-black text-sm ${acc.balance < 0 ? 'text-danger' : 'text-white'}`}>
                  ${acc.balance.toLocaleString()}
                </p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteAccount(acc.id);
                  }}
                  className="size-10 rounded-xl bg-danger/10 text-danger flex items-center justify-center transition-all active:scale-90"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            </div>
          ))}
          {accounts.length === 0 && <p className="text-center py-6 text-neutral-700 text-[10px] font-black uppercase">No active accounts</p>}
        </div>
      </section>

      {/* Savings Goals Section */}
      <section>
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-sm font-black uppercase tracking-widest text-neutral-500">Savings Goals</h3>
          <button onClick={onAddSaving} className="size-8 rounded-full bg-white/10 text-white flex items-center justify-center border border-white/10">
            <span className="material-symbols-outlined text-sm font-black">add</span>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {savings.map(s => (
            <div key={s.id} className="p-5 bg-neutral-900/50 border border-white/5 rounded-[32px] flex flex-col gap-4">
              <span className="material-symbols-outlined text-primary">{s.icon}</span>
              <div>
                <p className="font-black text-xs uppercase tracking-tight text-white">{s.name}</p>
                <p className="text-[10px] text-neutral-600 font-bold uppercase">${s.currentAmount.toLocaleString()} / ${s.targetAmount.toLocaleString()}</p>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${Math.min(100, (s.currentAmount / s.targetAmount) * 100)}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Debts Section */}
      <section>
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-sm font-black uppercase tracking-widest text-neutral-500">Outstanding Debts</h3>
          <button onClick={onAddDebt} className="size-8 rounded-full bg-danger/10 text-danger flex items-center justify-center border border-danger/10">
            <span className="material-symbols-outlined text-sm font-black">add</span>
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {debts.map(d => (
            <div key={d.id} className="p-5 bg-danger/5 border border-danger/10 rounded-[32px] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-xl bg-danger/20 text-danger flex items-center justify-center">
                  <span className="material-symbols-outlined">{d.icon}</span>
                </div>
                <p className="font-black text-xs uppercase text-danger">{d.name}</p>
              </div>
              <p className="font-black text-xs text-danger uppercase">Remaining: ${d.remainingAmount.toLocaleString()} {d.currency}</p>
            </div>
          ))}
          {debts.length === 0 && <p className="text-center py-4 text-neutral-700 text-[10px] font-black uppercase tracking-widest italic">Debt-free! Keep it up.</p>}
        </div>
      </section>
    </div>
  );
};

export default ManageAccountsView;
