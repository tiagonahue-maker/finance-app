
import React from 'react';

const BudgetView: React.FC = () => {
  const categories = [
    { name: 'Groceries', spent: 200, limit: 500, icon: 'shopping_cart', color: 'primary' },
    { name: 'Transport', spent: 425, limit: 500, icon: 'directions_bus', status: 'Near Limit', color: 'warning' },
    { name: 'Dining', spent: 320, limit: 300, icon: 'restaurant', status: 'Over Budget', color: 'danger', over: 20 },
    { name: 'Entertainment', spent: 50, limit: 200, icon: 'movie', color: 'primary' },
    { name: 'Utilities', spent: 15, limit: 150, icon: 'bolt', color: 'primary' }
  ];

  return (
    <div className="flex flex-col px-6 pt-6 gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button className="size-10 rounded-full bg-neutral-800 flex items-center justify-center">
          <span className="material-symbols-outlined text-white">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold">September Budget</h1>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-surface-dark">
          <span className="text-xs font-bold">Sept 2023</span>
          <span className="material-symbols-outlined text-sm">calendar_month</span>
        </button>
      </div>

      {/* Circular Chart Card */}
      <section className="bg-surface-dark rounded-2xl p-8 flex flex-col items-center shadow-lg border border-white/5">
        <h2 className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-6">Overall Status</h2>
        <div className="relative size-60 flex items-center justify-center">
          <svg className="size-full -rotate-90 transform" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="70" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-white/5" />
            <circle 
              cx="80" cy="80" r="70" fill="transparent" stroke="currentColor" strokeWidth="12" 
              strokeDasharray="440" strokeDashoffset="185" strokeLinecap="round"
              className="text-primary drop-shadow-[0_0_15px_rgba(19,236,91,0.25)]" 
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-extrabold tracking-tight">$1,250</span>
            <span className="text-primary text-sm font-bold uppercase mt-1">Left</span>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p className="text-neutral-500 text-sm font-medium">of <span className="text-white font-bold">$3,000</span> Total Budget</p>
          <div className="flex items-center gap-2 mt-2 px-4 py-1.5 bg-primary/10 rounded-full mx-auto w-fit">
            <span className="size-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-primary text-xs font-bold uppercase">On Track</span>
          </div>
        </div>
      </section>

      {/* Alert */}
      <section className="bg-danger/10 border border-danger/20 rounded-xl p-4 flex items-start gap-3">
        <span className="material-symbols-outlined text-danger">warning</span>
        <div className="flex-1">
          <h3 className="text-danger font-bold text-sm">Budget Exceeded</h3>
          <p className="text-danger/70 text-sm leading-tight mt-1">You've exceeded your <strong>Dining</strong> budget by $20. Consider reallocating funds.</p>
        </div>
        <button className="text-danger text-sm font-bold hover:underline">Review</button>
      </section>

      {/* Categories */}
      <section className="pb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Categories</h3>
          <button className="text-primary text-sm font-bold">Edit Budget</button>
        </div>
        <div className="flex flex-col gap-3">
          {categories.map((cat, idx) => (
            <div key={idx} className={`p-4 bg-surface-dark rounded-xl border ${cat.status === 'Over Budget' ? 'border-danger/30' : 'border-white/5'}`}>
              <div className="flex items-center gap-4 mb-3">
                <div className={`size-10 rounded-full flex items-center justify-center bg-neutral-800 text-${cat.color === 'primary' ? 'primary' : cat.color === 'warning' ? 'warning' : 'danger'}`}>
                  <span className="material-symbols-outlined">{cat.icon}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold">{cat.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    {cat.status ? (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded bg-${cat.color}-500/10 text-${cat.color === 'warning' ? 'warning' : 'danger'}`}>
                        {cat.status}
                      </span>
                    ) : (
                      <span className="text-xs text-neutral-500 font-medium">
                        {Math.round((cat.spent/cat.limit)*100)}% spent
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${cat.status === 'Over Budget' ? 'text-danger' : 'text-white'}`}>${cat.spent}</p>
                  <p className="text-xs text-neutral-500">of ${cat.limit}</p>
                </div>
              </div>
              <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-${cat.color === 'primary' ? 'primary' : cat.color === 'warning' ? 'warning' : 'danger'}`} 
                  style={{ width: `${Math.min(100, (cat.spent/cat.limit)*100)}%` }}
                ></div>
              </div>
              {cat.over && <p className="text-danger text-right text-[10px] font-bold mt-1.5">-${cat.over} over limit</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BudgetView;
