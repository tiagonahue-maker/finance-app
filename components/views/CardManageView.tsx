
import React from 'react';

interface CardManageViewProps {
  onBack: () => void;
}

const CardManageView: React.FC<CardManageViewProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col bg-background-dark min-h-screen">
      <header className="sticky top-0 z-50 flex items-center bg-background-dark/95 backdrop-blur-md px-4 py-4 border-b border-white/5">
        <button onClick={onBack} className="size-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-10">Card Controls</h2>
      </header>

      <div className="px-6 py-8 space-y-10">
        {/* Card Preview */}
        <div className="h-48 w-full bg-neutral-900 rounded-3xl p-6 border border-white/10 flex flex-col justify-between shadow-2xl relative overflow-hidden">
           <div className="absolute -top-10 -right-10 size-40 bg-primary/10 rounded-full blur-3xl"></div>
           <div className="flex justify-between items-start z-10">
              <h3 className="font-bold text-white">Manual Debit Card</h3>
              <div className="size-6 bg-primary/20 rounded-full animate-pulse border border-primary/50"></div>
           </div>
           <div className="z-10">
              <p className="text-white font-mono tracking-widest">•••• •••• •••• 8842</p>
              <div className="flex justify-between mt-4">
                 <p className="text-neutral-500 text-[10px] uppercase font-bold">Active Status</p>
                 <span className="text-primary text-[10px] font-bold uppercase tracking-widest">Unlocked</span>
              </div>
           </div>
        </div>

        {/* Security Settings */}
        <section className="space-y-4">
          <h3 className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest ml-1">Security</h3>
          <div className="bg-surface-dark rounded-2xl divide-y divide-white/5 border border-white/5 overflow-hidden">
            {[
              { icon: 'ac_unit', label: 'Freeze Card', sub: 'Instantly block all transactions', toggle: true },
              { icon: 'password', label: 'Reset PIN', sub: 'Change your 4-digit manual PIN' },
              { icon: 'payments', label: 'Limits', sub: 'Set daily spending threshold' }
            ].map((item, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-neutral-800 flex items-center justify-center text-neutral-400">
                    <span className="material-symbols-outlined text-xl">{item.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{item.label}</p>
                    <p className="text-[10px] text-neutral-500 font-bold tracking-tight">{item.sub}</p>
                  </div>
                </div>
                {item.toggle ? (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-neutral-800 rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                  </label>
                ) : (
                  <span className="material-symbols-outlined text-neutral-600">chevron_right</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Card Details */}
        <section className="space-y-4">
          <h3 className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest ml-1">Card Details</h3>
          <div className="bg-surface-dark rounded-2xl border border-white/5 p-5 space-y-6">
             <div className="flex justify-between items-center">
                <span className="text-neutral-500 text-sm font-medium">Card Brand</span>
                <span className="text-white font-bold">Manual Debit</span>
             </div>
             <div className="flex justify-between items-center">
                {/* Fixed: Translated Spanish text to English */}
                <span className="text-neutral-500 text-sm font-medium">Manual Close</span>
                <span className="text-white font-bold">Day 15 of each month</span>
             </div>
             <div className="flex justify-between items-center">
                {/* Fixed: Translated Spanish text to English */}
                <span className="text-neutral-500 text-sm font-medium">Due Date</span>
                <span className="text-danger font-bold">Day 10 of each month</span>
             </div>
          </div>
        </section>
        
        <button 
          onClick={onBack}
          className="w-full bg-surface-dark-high py-4 rounded-2xl text-white font-bold border border-white/10 active:scale-95 transition-all"
        >
          Confirm Changes
        </button>
      </div>
    </div>
  );
};

export default CardManageView;
