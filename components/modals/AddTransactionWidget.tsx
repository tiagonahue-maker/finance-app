
import React, { useState } from 'react';
import { Account, Category, Transaction } from '../../types';

interface AddTransactionWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  categories: Category[];
  onSave: (tx: Transaction) => void;
}

const AddTransactionWidget: React.FC<AddTransactionWidgetProps> = ({ isOpen, onClose, accounts, categories, onSave }) => {
  const [amountStr, setAmountStr] = useState('0');
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.id || '');
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0]?.id || '');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleKeyPress = (key: string) => {
    if (key === 'backspace') {
      setAmountStr(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    } else if (key === ',') {
      // Internal normalized to dot for parseFloat
      if (!amountStr.includes('.')) setAmountStr(prev => prev + '.');
    } else {
      setAmountStr(prev => prev === '0' ? key : prev + key);
    }
  };

  const handleConfirm = () => {
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0 || !selectedAccountId) return;

    const acc = accounts.find(a => a.id === selectedAccountId);
    const cat = categories.find(c => c.id === selectedCategoryId);

    onSave({
      id: Math.random().toString(36).substr(2, 9),
      accountId: selectedAccountId,
      amount,
      currency: acc?.currency || 'ARS',
      category: cat?.name || 'General',
      merchant: note || cat?.name || 'Manual Expense',
      time: Date.now(),
      type: 'expense',
      note: note || undefined
    });
    
    // UI Cleanup
    setAmountStr('0');
    setNote('');
    onClose();
  };

  const selectedAcc = accounts.find(a => a.id === selectedAccountId);

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md bg-[#121214] rounded-t-[40px] border-t border-white/10 shadow-2xl animate-in slide-in-from-bottom duration-300 p-8">
        <div className="w-12 h-1 bg-neutral-800 rounded-full mx-auto mb-8"></div>

        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <select 
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="w-full bg-[#5d6be5] text-white py-3 px-4 rounded-2xl border-none appearance-none font-bold text-sm shadow-lg"
            >
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none">expand_more</span>
          </div>

          <div className="flex-1 relative">
            <select 
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="w-full bg-neutral-800 text-white py-3 px-4 rounded-2xl border-none appearance-none font-bold text-sm"
            >
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none">expand_more</span>
          </div>
        </div>

        <div className="flex flex-col items-center mb-10">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl text-neutral-600 font-bold uppercase tracking-tight">{selectedAcc?.currency || 'ARS'}</span>
            <span className="text-7xl font-extrabold tracking-tighter text-white">{amountStr.replace('.', ',')}</span>
          </div>
          <input 
            placeholder="Add note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-4 bg-transparent border-none text-center text-neutral-500 font-medium placeholder-neutral-700 w-full focus:ring-0"
          />
        </div>

        <button 
          onClick={handleConfirm}
          className="w-full py-4 bg-white text-black rounded-full font-black text-lg mb-8 active:scale-95 transition-all shadow-xl"
        >
          Save Transaction
        </button>

        <div className="grid grid-cols-3 gap-y-4 gap-x-12 text-center pb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, ',', 0, 'backspace'].map((key) => (
            <button 
              key={key}
              onClick={() => handleKeyPress(key.toString())}
              className="py-3 text-3xl font-medium active:bg-white/5 rounded-full flex items-center justify-center transition-all text-white/90"
            >
              {key === 'backspace' ? (
                <span className="material-symbols-outlined text-3xl">backspace</span>
              ) : key}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddTransactionWidget;
