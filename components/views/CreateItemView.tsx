
import React, { useState } from 'react';
import { AccountType, Currency } from '../../types';

interface CreateItemViewProps {
  type: 'account' | 'saving' | 'debt';
  onBack: () => void;
  onSave: (item: any) => void;
}

const COLORS = ['blue', 'emerald', 'indigo', 'orange', 'red', 'purple', 'pink', 'amber'];
const ICONS = ['account_balance', 'payments', 'credit_card', 'savings', 'flight', 'directions_car', 'home', 'shopping_bag'];

const CreateItemView: React.FC<CreateItemViewProps> = ({ type, onBack, onSave }) => {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [target, setTarget] = useState('');
  const [accType, setAccType] = useState<AccountType>('Debit');
  const [currency, setCurrency] = useState<Currency>('ARS');
  const [color, setColor] = useState('blue');
  const [icon, setIcon] = useState('account_balance');

  const handleSave = () => {
    if (!name) return;
    
    const id = Math.random().toString(36).substr(2, 9);
    
    if (type === 'account') {
      onSave({ id, name, type: accType, currency, balance: parseFloat(balance) || 0, color, icon });
    } else if (type === 'saving') {
      onSave({ id, name, targetAmount: parseFloat(target) || 100, currentAmount: parseFloat(balance) || 0, currency, color, icon });
    } else {
      onSave({ id, name, totalAmount: parseFloat(target) || 100, remainingAmount: parseFloat(target) || 100, currency, color, icon });
    }
  };

  return (
    <div className="px-6 pt-10 flex flex-col gap-10 min-h-screen">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="size-10 rounded-full bg-neutral-900 flex items-center justify-center text-white border border-white/5">
            <span className="material-symbols-outlined">close</span>
          </button>
          <h2 className="text-xl font-black tracking-tighter capitalize">Add {type}</h2>
        </div>
        <button onClick={handleSave} className="text-primary font-black uppercase text-xs tracking-widest">Done</button>
      </header>

      <div className="space-y-8">
        <div>
          <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-2 mb-2 block">General Info</label>
          <div className="bg-neutral-900/50 rounded-[32px] p-8 border border-white/5 space-y-6">
            <input 
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Name (e.g. My Savings)"
              className="w-full bg-transparent border-none p-0 text-2xl font-black placeholder-neutral-700 focus:ring-0"
            />
            <div className="flex items-center gap-3">
               <span className="text-2xl font-black text-neutral-600">{currency}</span>
               <input 
                 value={balance}
                 onChange={e => setBalance(e.target.value)}
                 type="number"
                 placeholder="Current Amount"
                 className="flex-1 bg-transparent border-none p-0 text-2xl font-black placeholder-neutral-700 focus:ring-0"
               />
            </div>
            {(type === 'saving' || type === 'debt') && (
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Goal</span>
                <input 
                  value={target}
                  onChange={e => setTarget(e.target.value)}
                  type="number"
                  placeholder="Total Target"
                  className="flex-1 bg-transparent border-none p-0 font-black placeholder-neutral-700 focus:ring-0"
                />
              </div>
            )}
          </div>
        </div>

        {type === 'account' && (
          <div>
            <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-2 mb-2 block">Details</label>
            <div className="flex gap-2">
              {['Debit', 'Credit', 'Cash'].map(t => (
                <button 
                  key={t}
                  onClick={() => setAccType(t as any)}
                  className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${accType === t ? 'bg-primary text-black border-primary shadow-lg shadow-primary/20' : 'bg-neutral-900 text-neutral-500 border-white/5'}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              {['ARS', 'USD'].map(c => (
                <button 
                  key={c}
                  onClick={() => setCurrency(c as any)}
                  className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${currency === c ? 'bg-white text-black border-white' : 'bg-neutral-900 text-neutral-500 border-white/5'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
           <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-2 mb-3 block">Icon & Style</label>
           <div className="grid grid-cols-4 gap-4">
              {ICONS.map(i => (
                <button 
                  key={i}
                  onClick={() => setIcon(i)}
                  className={`size-14 rounded-3xl flex items-center justify-center border transition-all ${icon === i ? 'bg-white/10 border-primary text-primary' : 'bg-neutral-900 border-white/5 text-neutral-500'}`}
                >
                  <span className="material-symbols-outlined">{i}</span>
                </button>
              ))}
           </div>
        </div>

        <div>
           <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-2 mb-3 block">Color Accent</label>
           <div className="flex flex-wrap gap-4">
              {COLORS.map(c => (
                <button 
                  key={c}
                  onClick={() => setColor(c)}
                  className={`size-10 rounded-full border-2 transition-all ${color === c ? 'border-white scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: `var(--tw-color-${c}-500, ${c})` }}
                />
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default CreateItemView;
