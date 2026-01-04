
import React from 'react';

interface NewBudgetViewProps {
  onBack: () => void;
}

const NewBudgetView: React.FC<NewBudgetViewProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col bg-background-dark min-h-screen">
      <header className="sticky top-0 z-50 flex items-center bg-background-dark/95 backdrop-blur-md px-4 py-3 justify-between">
        <button onClick={onBack} className="size-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">New Budget</h2>
      </header>

      <div className="px-6 py-6 space-y-8 pb-32">
        {/* Budget Name */}
        <div>
          <label className="block text-sm font-bold mb-2 ml-1">Budget Name</label>
          <input 
            className="w-full bg-surface-dark border border-white/10 rounded-xl px-4 py-3.5 text-white font-bold focus:ring-2 focus:ring-primary/50 placeholder-neutral-600 transition-all shadow-sm"
            defaultValue="October Plan"
          />
        </div>

        {/* Info Box */}
        <div className="p-4 bg-primary/10 rounded-xl border border-primary/20 flex gap-3 items-start">
          <span className="material-symbols-outlined text-primary shrink-0">info</span>
          <p className="text-sm text-neutral-300 leading-relaxed font-medium">
            Customize your categories and spending limits below. Enable rollover to automatically carry unspent funds to the next period.
          </p>
        </div>

        {/* Total Limit */}
        <section>
          <h3 className="text-xl font-bold mb-3">Total Limit</h3>
          <div className="bg-surface-dark rounded-xl p-6 shadow-sm border border-white/5">
            <span className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest mb-2 block">Estimated Monthly Income</span>
            <div className="relative flex items-center">
              <span className="absolute left-0 text-neutral-500 text-2xl font-medium">$</span>
              <input className="w-full bg-transparent border-none text-white text-4xl font-extrabold p-0 pl-7 focus:ring-0" defaultValue="4250.00" type="number" />
            </div>
          </div>
        </section>

        {/* Allocation Progress */}
        <div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-neutral-500 text-sm font-medium">Allocated to Categories</span>
            <div className="text-right">
              <span className="text-primary font-bold text-lg">$3,400</span>
              <span className="text-neutral-500 text-sm"> / $4,250</span>
            </div>
          </div>
          <div className="h-3 w-full bg-surface-dark rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[80%] rounded-full shadow-[0_0_10px_rgba(19,236,91,0.5)]"></div>
          </div>
          <p className="text-right text-[10px] text-neutral-500 font-bold mt-2 uppercase tracking-widest">80% of income assigned</p>
        </div>

        {/* Categories */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Categories</h3>
            <button className="flex items-center gap-1 text-primary text-sm font-bold py-1 px-2 rounded-lg hover:bg-primary/10">
              <span className="material-symbols-outlined text-lg">add</span> Add Category
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Housing', sub: 'Rent, Utilities', icon: 'home', color: 'blue', value: 1800 },
              { label: 'Food', sub: 'Groceries, Dining out', icon: 'restaurant', color: 'orange', value: 600 },
              { label: 'Transport', sub: 'Gas, Public transit', icon: 'commute', color: 'purple', value: 350 },
              { label: 'Savings', sub: 'Emergency Fund', icon: 'savings', color: 'primary', value: 650, active: true },
            ].map((cat, idx) => (
              <div key={idx} className={`flex items-center gap-3 bg-surface-dark p-3 rounded-xl border ${cat.active ? 'border-l-4 border-l-primary border-white/5' : 'border-white/5'}`}>
                <div className={`size-10 rounded-full bg-${cat.color === 'primary' ? 'primary' : cat.color}-500/10 flex items-center justify-center shrink-0`}>
                  <span className={`material-symbols-outlined text-${cat.color === 'primary' ? 'primary' : cat.color}-500`}>{cat.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white truncate">{cat.label}</p>
                  <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">{cat.sub}</p>
                </div>
                <div className="w-28 relative">
                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-xs">$</span>
                   <input className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-6 pr-3 text-right font-bold text-sm focus:ring-primary focus:border-primary" defaultValue={cat.value} type="number" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Preferences */}
        <section>
          <h3 className="text-lg font-bold mb-3">Preferences</h3>
          <div className="bg-surface-dark rounded-xl p-4 border border-white/5 flex items-center justify-between">
            <div className="pr-4">
              <p className="font-bold">Enable Rollover</p>
              <p className="text-xs text-neutral-500 mt-1">Unspent money moves to next month's budget automatically.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </section>
      </div>

      {/* Persistent Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background-dark via-background-dark to-transparent z-50 max-w-md mx-auto">
        <button onClick={onBack} className="w-full bg-primary py-4 rounded-xl text-black font-extrabold text-lg flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-primary/20">
          Create Budget
          <span className="material-symbols-outlined font-bold">check</span>
        </button>
      </div>
    </div>
  );
};

export default NewBudgetView;
