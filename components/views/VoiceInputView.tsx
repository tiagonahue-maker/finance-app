
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Account, Transaction, Category } from '../../types';

interface VoiceInputViewProps {
  accounts: Account[];
  // Fixed: Added categories property to props
  categories: Category[];
  onBack: () => void;
  onConfirm: (tx: Transaction) => void;
}

const VoiceInputView: React.FC<VoiceInputViewProps> = ({ accounts, categories, onBack, onConfirm }) => {
  const [isListening, setIsListening] = useState(true);
  // Fixed: Translated Spanish text to English
  const [transcript, setTranscript] = useState("Listening...");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedTx, setProcessedTx] = useState<Partial<Transaction> | null>(null);

  useEffect(() => {
    // Simulate speech-to-text for demo purposes
    const timer = setTimeout(() => {
      handleProcessTranscription("Spent 1500 ars at the supermarket today.");
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleProcessTranscription = async (text: string) => {
    setTranscript(text);
    setIsProcessing(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze this note and extract transaction data. 
        Note: "${text}"
        Available Accounts: ${accounts.map(a => a.name).join(', ')}
        Standard Categories: Food, Transport, Shopping, Entertainment, Bills, Salary, Other.
        Return JSON.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              amount: { type: Type.NUMBER },
              category: { type: Type.STRING },
              accountName: { type: Type.STRING },
              type: { type: Type.STRING, enum: ['expense', 'income'] },
              merchant: { type: Type.STRING }
            },
            required: ['amount', 'type']
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      const matchedAccount = accounts.find(a => a.name.toLowerCase().includes(data.accountName?.toLowerCase())) || accounts[0];
      
      setProcessedTx({
        accountId: matchedAccount.id,
        amount: data.amount,
        merchant: data.merchant || data.category || 'Voice Entry',
        category: data.category || 'Other',
        currency: matchedAccount.currency,
        type: data.type || 'expense'
      });
      
      setTranscript(`Confirm: ${data.amount} ${matchedAccount.currency.toLowerCase()} for ${data.merchant || data.category}`);
    } catch (error) {
      console.error("IA Processing error:", error);
      setTranscript("Couldn't process that. Try: 'Spent 500 ars on food'");
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmTransaction = () => {
    if (processedTx && processedTx.amount) {
      // Fixed: time must be a number (timestamp)
      onConfirm({
        id: Math.random().toString(36).substr(2, 9),
        time: Date.now(),
        ...(processedTx as Transaction)
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-between h-screen bg-background-dark px-8 py-12">
      <header className="w-full flex justify-start">
        <button 
          onClick={onBack}
          className="size-12 rounded-full bg-neutral-900 border border-white/5 flex items-center justify-center text-white"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center gap-12 w-full">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping scale-150 opacity-20"></div>
          <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse scale-125"></div>
          <div className="relative size-32 rounded-full bg-primary flex items-center justify-center shadow-[0_0_50px_rgba(19,236,91,0.5)] z-10">
            <span className="material-symbols-outlined text-5xl text-black font-bold">mic</span>
          </div>
        </div>

        <div className="text-center space-y-4">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Voice Recognition</h2>
          <p className="text-neutral-500 text-sm font-medium max-w-[240px]">
            Say: "Spent 5000 ars on groceries"
          </p>
        </div>

        <div className="w-full bg-neutral-900/50 p-6 rounded-3xl border border-white/5 min-h-[120px] flex items-center justify-center text-center">
          <p className={`text-lg font-bold transition-all duration-500 ${isProcessing ? 'text-neutral-600 animate-pulse' : 'text-primary'}`}>
            "{transcript}"
          </p>
        </div>
      </div>

      <div className="w-full grid grid-cols-2 gap-4">
        <button 
          onClick={onBack}
          className="py-4 rounded-2xl bg-neutral-800 text-white font-bold"
        >
          Cancel
        </button>
        <button 
          disabled={!processedTx || isProcessing}
          onClick={confirmTransaction}
          className="py-4 rounded-2xl bg-primary text-black font-extrabold disabled:opacity-50"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default VoiceInputView;
