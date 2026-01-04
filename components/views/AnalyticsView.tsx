
import React, { useState, useMemo } from 'react';
import { Transaction, Category } from '../../types';

interface AnalyticsViewProps {
  transactions: Transaction[];
  categories: Category[];
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ transactions, categories }) => {
  const [period, setPeriod] = useState<'WEEK' | 'MONTH' | 'YEAR'>('MONTH');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const date = new Date(t.time);
      if (period === 'MONTH') {
        return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
      }
      if (period === 'YEAR') {
        return date.getFullYear() === selectedYear;
      }
      if (period === 'WEEK') {
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        return date >= startOfWeek;
      }
      return true;
    });
  }, [transactions, period, selectedMonth, selectedYear]);

  const totalSpent = filteredTransactions
    .filter(t => t.type === 'expense' && t.currency === 'ARS')
    .reduce((sum, t) => sum + t.amount, 0);

  const statsByCategory = useMemo(() => {
    const stats = categories.map(cat => {
      const amount = filteredTransactions
        .filter(t => t.category === cat.name && t.type === 'expense' && t.currency === 'ARS')
        .reduce((sum, t) => sum + t.amount, 0);
      return {
        ...cat,
        amount,
        pct: totalSpent > 0 ? (amount / totalSpent) * 100 : 0
      };
    }).sort((a, b) => b.amount - a.amount);

    // Filter out categories with 0 spending for the chart visualization
    return stats;
  }, [filteredTransactions, categories, totalSpent]);

  // Generate the conic gradient string for the donut chart
  const donutGradient = useMemo(() => {
    let currentPercentage = 0;
    const segments = statsByCategory
      .filter(s => s.amount > 0)
      .map(s => {
        const start = currentPercentage;
        currentPercentage += s.pct;
        return `${s.color} ${start}% ${currentPercentage}%`;
      });
    
    if (segments.length === 0) return 'rgba(255,255,255,0.05) 0% 100%';
    return segments.join(', ');
  }, [statsByCategory]);

  return (
    <div className="flex flex-col px-6 pt-10 gap-8 min-h-screen animate-in fade-in duration-500 pb-32">
      <header className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black uppercase tracking-widest text-neutral-400">Spending Overview</h2>
          <div className="flex items-center gap-2 bg-neutral-900 px-3 py-1.5 rounded-full border border-white/5">
             <span className="material-symbols-outlined text-neutral-500 text-sm">calendar_month</span>
             <select 
               value={selectedMonth} 
               onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
               className="bg-transparent border-none p-0 text-[10px] font-black uppercase tracking-widest text-neutral-300 focus:ring-0 cursor-pointer"
             >
               {MONTHS.map((m, i) => <option key={m} value={i} className="bg-neutral-900">{m}</option>)}
             </select>
          </div>
        </div>
      </header>

      {/* Dynamic Donut Chart */}
      <div className="relative flex flex-col items-center justify-center py-6">
        <div className="relative size-64 rounded-full flex items-center justify-center">
          <div 
            className="absolute inset-0 rounded-full border-[12px] border-neutral-900 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] transition-all duration-700 ease-in-out"
            style={{
              background: `conic-gradient(${donutGradient})`,
              WebkitMaskImage: 'radial-gradient(transparent 65%, black 66%)',
              maskImage: 'radial-gradient(transparent 65%, black 66%)'
            }}
          />
          <div className="text-center z-10">
            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1">Total Expense</p>
            <h1 className="text-4xl font-black tracking-tighter">${totalSpent.toLocaleString()}</h1>
            <p className="text-[10px] font-black text-primary uppercase mt-1">ARS</p>
          </div>
        </div>
      </div>

      {/* Filter Switcher */}
      <div className="flex justify-center gap-8">
        {['WEEK', 'MONTH', 'YEAR'].map(p => (
          <button 
            key={p}
            onClick={() => setPeriod(p as any)}
            className={`text-[10px] font-black tracking-widest uppercase transition-all ${period === p ? 'text-primary scale-110' : 'text-neutral-600'}`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Spending Categories Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-neutral-400">Spending categories</h3>
          <span className="text-[10px] font-black text-neutral-600 uppercase">{statsByCategory.filter(s => s.amount > 0).length} active</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {statsByCategory.map(cat => (
            <div 
              key={cat.id} 
              className={`p-5 bg-neutral-900/40 border border-white/5 rounded-[32px] flex flex-col justify-between h-36 relative overflow-hidden group hover:border-white/10 transition-all ${cat.amount === 0 ? 'opacity-40 grayscale' : ''}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-sm" style={{ color: cat.color }}>{cat.icon}</span>
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-tight truncate max-w-[80px]">{cat.name}</p>
                  </div>
                  <p className="font-black text-base tracking-tighter text-white">${cat.amount.toLocaleString()}</p>
                </div>
                <span className="text-[10px] font-black text-neutral-600 uppercase bg-black/20 px-2 py-0.5 rounded-md">{Math.round(cat.pct)}%</span>
              </div>
              
              <div className="space-y-2">
                <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000 ease-out" 
                    style={{ backgroundColor: cat.color, width: `${cat.pct}%` }} 
                  ></div>
                </div>
                {cat.limit && (
                   <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest">
                     <span className="text-neutral-600">Limit</span>
                     <span className={cat.amount > cat.limit ? 'text-danger' : 'text-neutral-500'}>${cat.limit.toLocaleString()}</span>
                   </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AnalyticsView;
