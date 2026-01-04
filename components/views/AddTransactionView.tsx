
import React, { useState } from 'react';
import { Account, Currency, Transaction } from '../../types';

interface AddTransactionViewProps {
  accounts: Account[];
  onBack: () => void;
  onSave: (tx: Transaction) => void;
}

const CATEGORIES = [
  { id: 'food', name: 'Food & Drink', icon: 'restaurant', color: 'orange' },
  { id: 'shopping', name: 'Shopping', icon: 'shopping_bag', color: 'purple' },
  { id: 'transport', name: 'Transport', icon: 'commute', color: 'blue' },
  { id: 'entertainment', name: 'Leisure', icon: 'movie', color: 'pink' },
  { id: 'travel', name: 'Trip to Japan', icon: 'flight', color: 'indigo' },
];

const AddTransactionView: React.FC<AddTransactionViewProps> = ({ accounts, onBack, onSave }) => {
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.id || '');
  const [selectedCategoryId, setSelectedCategoryId] = useState(CATEGORIES[0].id);
  const [amountStr, setAmountStr] = useState('0');
  const [note, setNote] = useState('');

  const selectedAccount = accounts.find(a => a.id === selectedAccountId);
  const selectedCategory = CATEGORIES.find(c => c.id === selectedCategoryId);

  const handleKeyPress = (key: string) => {
    if (key === 'backspace') {
      setAmountStr(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    } else if (key === ',') {
      if (!amountStr.includes('.')) setAmountStr(prev => prev + '.');
    } else {
      setAmountStr(prev => prev === '0' ? key : prev + key);
    }
  };

  const handleSave = () => {
    if (parseFloat(amountStr) <= 0) return;
    
    // Fixed: time must be a number (timestamp)
    // Removed icon and iconColor as they are not properties of Transaction
    const tx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      accountId: selectedAccountId,
      merchant: selectedCategory?.name || 'Manual Expense',
      category: selectedCategory?.name || 'Other',
      amount: parseFloat(amountStr),
      currency: selectedAccount?.currency || 'ARS',
      time: Date.now(),
      type: 'expense',
      note
    };
    onSave(tx);
  };

  return (
    <div className="flex flex-col h-screen bg-background-dark text-white px-6 py-12">
      {/* Top Selectors */}
      <div className="flex gap-4 mb-12">
        <div className="relative flex-1">
          <select 
            value={selectedAccountId}
            onChange={(e) => setSelectedAccountId(e.target.value)}
            className="w-full bg-[#5d6be5] text-white py-3 px-4 rounded-2xl border-none appearance-none font-bold text-sm"
          >
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id}>{acc.name}</option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none">expand_more</span>
        </div>
        
        <div className="relative flex-1">
          <select 
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="w-full bg-neutral-800/80 text-white py-3 px-4 rounded-2xl border-none appearance-none font-bold text-sm"
          >
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none">expand_more</span>
        </div>
      </div>

      {/* Amount Display */}
      <div className="flex-1 flex flex-col items-center justify-center -mt-12">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl text-neutral-500 font-medium">{selectedAccount?.currency === 'USD' ? 'usd' : 'ars'}</span>
          <h1 className="text-7xl font-bold tracking-tight">{amountStr}</h1>
        </div>
        
        <input 
          // Fixed: Translated Spanish text to English
          placeholder="Add note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="mt-6 bg-transparent border-none text-center text-neutral-500 text-lg focus:ring-0 placeholder-neutral-700 w-full"
        />
      </div>

      {/* Actions */}
      <div className="space-y-8">
        <button 
          onClick={handleSave}
          // Fixed: Translated Spanish text to English
          className="w-full py-4 bg-white/90 text-black font-extrabold rounded-full text-lg active:scale-95 transition-all shadow-xl"
        >
          Save
        </button>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-y-4 gap-x-8 text-center">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, ',', 0, 'backspace'].map((key) => (
            <button 
              key={key}
              onClick={() => handleKeyPress(key.toString())}
              className="py-4 text-3xl font-medium active:bg-white/5 rounded-full flex items-center justify-center transition-colors"
            >
              {key === 'backspace' ? (
                <span className="material-symbols-outlined text-4xl">backspace</span>
              ) : key}
            </button>
          ))}
        </div>
      </div>
      
      {/* Back button hidden or accessible via top if needed, but the UI is focused */}
      <button onClick={onBack} className="absolute top-4 left-6 text-neutral-500">
        <span className="material-symbols-outlined">close</span>
      </button>
    </div>
  );
};

export default AddTransactionView;
