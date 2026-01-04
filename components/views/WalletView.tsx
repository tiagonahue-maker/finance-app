
import React, { useState } from 'react';
import { Account, Currency } from '../../types';

interface WalletViewProps {
  accounts: Account[];
  onBack: () => void;
  onEditAccount: (id: string) => void;
  onAddAccount: () => void;
  onPayCard: (cardId: string, sourceId: string, amount: number) => void;
}

const WalletView: React.FC<WalletViewProps> = ({ accounts, onBack, onEditAccount, onAddAccount, onPayCard }) => {
  const [payingCardId, setPayingCardId] = useState<string | null>(null);

  const bankAccounts = accounts.filter(a => ['Debit', 'Credit', 'Cash'].includes(a.type));
  const goalAccounts = accounts.filter(a => ['Savings', 'Loan'].includes(a.type));
  
  // Potential payment sources for credit cards
  const paymentSources = accounts.filter(a => (a.type === 'Debit' || a.type === 'Cash') && a.balance > 0);

  const formatCurrency = (amount: number, currency: Currency) => {
    const formatted = Math.abs(amount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    return `${formatted} ${currency.toLowerCase()}`;
  };

  const handlePayClick = (e: React.MouseEvent, card: Account) => {
    e.stopPropagation();
    setPayingCardId(card.id);
  };

  const executePayment = (sourceId: string) => {
    const card = accounts.find(a => a.id === payingCardId);
    if (!card) return;
    
    // Clear the ENTIRE current debt from the source
    const amountToPay = Math.abs(card.balance);
    if (amountToPay <= 0) {
      alert("No debt to pay.");
      setPayingCardId(null);
      return;
    }

    onPayCard(card.id, sourceId, amountToPay);
    setPayingCardId(null);
  };

  const renderAccountCard = (acc: Account) => (
    <div 
      key={acc.id} 
      onClick={() => onEditAccount(acc.id)}
      className="group p-4 bg-neutral-900/30 rounded-2xl border border-white/5 flex flex-col gap-3 hover:border-primary/20 transition-all cursor-pointer active:scale-[0.98]"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`size-11 rounded-xl bg-${acc.color}-500/10 text-${acc.color}-500 flex items-center justify-center border border-white/5`}>
            <span className="material-symbols-outlined">{acc.icon}</span>
          </div>
          <div>
            <div className="flex items-center gap-10">
              <p className="font-bold text-white text-sm truncate max-w-[120px]">{acc.name}</p>
              <span className="text-[8px] px-1 py-0.5 rounded-sm bg-white/5 text-neutral-500 font-extrabold border border-white/5 uppercase shrink-0">{acc.currency.toLowerCase()}</span>
            </div>
            <p className="text-[9px] text-neutral-600 font-extrabold uppercase tracking-tight">{acc.type} • {acc.currency.toLowerCase()}</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className={`font-bold text-base uppercase ${acc.balance < 0 ? 'text-danger' : 'text-white'}`}>
            {formatCurrency(acc.balance, acc.currency)}
          </p>
          {acc.targetAmount && (
             <p className="text-[9px] text-neutral-500 font-bold mt-1 uppercase">
               Goal: {formatCurrency(acc.targetAmount, acc.currency)}
             </p>
          )}
        </div>
      </div>

      {acc.type === 'Credit' && acc.balance < 0 && (
        <div className="mt-2 flex items-center justify-between bg-white/[0.03] p-3 rounded-xl border border-white/5 animate-in fade-in slide-in-from-top-2">
          <div>
            <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Total Outstanding Debt</p>
            <p className="text-sm font-bold text-danger uppercase">{formatCurrency(acc.balance, acc.currency)}</p>
          </div>
          <button 
            onClick={(e) => handlePayClick(e, acc)}
            className="px-4 py-2 bg-primary text-black text-[10px] font-extrabold rounded-lg uppercase shadow-lg shadow-primary/10 active:scale-95 transition-all"
          >
            Pay Full Debt
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col px-6 pt-8 gap-8 pb-32 min-h-screen bg-background-dark">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="size-10 rounded-full bg-neutral-900 border border-white/5 flex items-center justify-center text-white"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-white">Full Portfolio</h1>
        </div>
        <button 
          onClick={onAddAccount}
          className="size-9 rounded-full bg-primary text-black flex items-center justify-center shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined font-bold">add</span>
        </button>
      </header>

      {/* Payment Selection Modal */}
      {payingCardId && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-end justify-center px-4">
          <div className="w-full max-w-sm bg-neutral-900 rounded-t-[40px] p-8 border-t border-white/10 animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1.5 bg-neutral-800 rounded-full mx-auto mb-6"></div>
            <h3 className="text-xl font-bold text-center mb-2">Pay Credit Card</h3>
            <p className="text-neutral-500 text-xs text-center mb-8 font-medium">Select an account to pay from</p>
            
            <div className="space-y-3 max-h-60 overflow-y-auto hide-scrollbar mb-8">
              {paymentSources.map(src => (
                <button 
                  key={src.id}
                  onClick={() => executePayment(src.id)}
                  className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-primary/50 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className={`material-symbols-outlined text-${src.color}-500`}>{src.icon}</span>
                    <div>
                      <p className="font-bold text-sm text-white">{src.name}</p>
                      <p className="text-[10px] text-neutral-500 font-bold uppercase">{src.currency.toLowerCase()} Balance</p>
                    </div>
                  </div>
                  <p className="font-bold text-sm uppercase text-white">{formatCurrency(src.balance, src.currency)}</p>
                </button>
              ))}
              {paymentSources.length === 0 && (
                <p className="text-center py-4 text-neutral-600 text-sm italic">No available payment sources.</p>
              )}
            </div>
            
            <button 
              onClick={() => setPayingCardId(null)}
              className="w-full py-4 text-neutral-400 font-bold text-sm hover:text-white transition-colors"
            >
              Cancel Payment
            </button>
          </div>
        </div>
      )}

      {/* Summary Card */}
      <section className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute -right-8 -top-8 size-48 bg-white/5 rounded-full blur-3xl"></div>
        <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest mb-2 text-center opacity-70">Consolidated Liquidity</p>
        <h2 className="text-3xl font-extrabold tracking-tighter text-center uppercase">
          {Math.floor(accounts.filter(a => a.balance > 0).reduce((sum, a) => sum + (a.balance), 0)).toLocaleString()} ars
        </h2>
        <div className="mt-8 flex gap-4">
          <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
            <p className="text-indigo-200 text-[9px] font-bold uppercase mb-1">Total Items</p>
            <p className="font-bold text-lg leading-none">{accounts.length}</p>
          </div>
          <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
            <p className="text-indigo-200 text-[9px] font-bold uppercase mb-1">Debts</p>
            <p className="font-bold text-lg leading-none">{accounts.filter(a => a.balance < 0).length}</p>
          </div>
        </div>
      </section>

      <div className="space-y-4">
        <h3 className="text-sm font-bold flex items-center gap-2 text-neutral-400 uppercase tracking-widest px-1">
          <span className="material-symbols-outlined text-sm text-primary">account_balance</span>
          Bank & Cash
        </h3>
        <div className="flex flex-col gap-3">
          {bankAccounts.map(renderAccountCard)}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold flex items-center gap-2 text-neutral-400 uppercase tracking-widest px-1">
          <span className="material-symbols-outlined text-sm text-warning">star</span>
          Savings & Long-Term
        </h3>
        <div className="flex flex-col gap-3">
          {goalAccounts.length > 0 ? goalAccounts.map(renderAccountCard) : (
             <div className="p-6 text-center bg-neutral-900/20 rounded-2xl border border-dashed border-white/5">
                <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest">No long-term linked</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletView;
