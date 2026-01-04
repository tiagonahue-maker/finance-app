
import React, { useState } from 'react';
import { Account, SavingGoal, Debt } from '../../types';

interface TransferWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  savings: SavingGoal[];
  debts: Debt[];
  onTransfer: (sourceId: string, targetId: string, targetType: 'account' | 'saving' | 'debt', amount: number) => void;
}

const TransferWidget: React.FC<TransferWidgetProps> = ({ isOpen, onClose, accounts, savings, debts, onTransfer }) => {
  const [amountStr, setAmountStr] = useState('0');
  const [sourceId, setSourceId] = useState(accounts[0]?.id || '');
  const [targetId, setTargetId] = useState('');
  const [targetType, setTargetType] = useState<'account' | 'saving' | 'debt'>('account');

  if (!isOpen) return null;

  const handleKeyPress = (key: string) => {
    if (key === 'backspace') {
      setAmountStr(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    } else if (key === ',') {
      if (!amountStr.includes('.')) setAmountStr(prev => prev + '.');
    } else {
      setAmountStr(prev => prev === '0' ? key : prev + key);
    }
  };

  const handleConfirm = () => {
    const amount = parseFloat(amountStr);
    if (amount <= 0 || !sourceId || !targetId) return;
    onTransfer(sourceId, targetId, targetType, amount);
    setAmountStr('0');
  };

  const sourceAcc = accounts.find(a => a.id === sourceId);

  return (
    <div className="fixed inset-0 z-[101] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md bg-[#0e0e10] rounded-t-[40px] border-t border-white/10 shadow-2xl animate-in slide-in-from-bottom duration-300 p-8">
        <div className="w-12 h-1 bg-neutral-800 rounded-full mx-auto mb-8"></div>
        
        <h3 className="text-center font-black uppercase tracking-widest text-neutral-500 text-[10px] mb-8">Transfer Funds</h3>

        {/* Transfer Path */}
        <div className="flex flex-col gap-4 mb-10">
          <div className="relative group">
            <label className="text-[8px] font-black uppercase text-neutral-600 absolute -top-2 left-4 px-2 bg-[#0e0e10] z-10">From Account</label>
            <select 
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              className="w-full bg-neutral-900 text-white py-4 px-5 rounded-2xl border border-white/5 appearance-none font-bold text-sm"
            >
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name} (${a.balance.toLocaleString()})</option>)}
            </select>
          </div>

          <div className="flex justify-center -my-2 relative z-10">
             <div className="size-8 rounded-full bg-primary text-black flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-sm font-black">south</span>
             </div>
          </div>

          <div className="relative group">
            <label className="text-[8px] font-black uppercase text-neutral-600 absolute -top-2 left-4 px-2 bg-[#0e0e10] z-10">To Destination</label>
            <select 
              value={`${targetType}:${targetId}`}
              onChange={(e) => {
                const [type, id] = e.target.value.split(':');
                setTargetType(type as any);
                setTargetId(id);
              }}
              className="w-full bg-neutral-900 text-white py-4 px-5 rounded-2xl border border-white/5 appearance-none font-bold text-sm"
            >
              <option value="">Select Destination...</option>
              <optgroup label="Accounts">
                {accounts.filter(a => a.id !== sourceId).map(a => <option key={a.id} value={`account:${a.id}`}>{a.name}</option>)}
              </optgroup>
              <optgroup label="Savings Goals">
                {savings.map(s => <option key={s.id} value={`saving:${s.id}`}>{s.name}</option>)}
              </optgroup>
              <optgroup label="Debts">
                {debts.map(d => <option key={d.id} value={`debt:${d.id}`}>{d.name}</option>)}
              </optgroup>
            </select>
          </div>
        </div>

        {/* Amount */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl text-neutral-600 font-bold uppercase tracking-tight">{sourceAcc?.currency || 'ARS'}</span>
            <span className="text-6xl font-extrabold tracking-tighter text-white">{amountStr}</span>
          </div>
        </div>

        <button 
          onClick={handleConfirm}
          disabled={!targetId}
          className="w-full py-5 bg-white text-black rounded-3xl font-black text-lg mb-8 active:scale-95 transition-all shadow-xl disabled:opacity-30"
        >
          Transfer Now
        </button>

        {/* Keypad */}
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

export default TransferWidget;
