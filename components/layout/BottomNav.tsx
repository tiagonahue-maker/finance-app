
import React from 'react';
import { AppView } from '../../types';

interface BottomNavProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onQuickAdd: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate, onQuickAdd }) => {
  // Fixed: Translated Spanish labels to English
  const navItems = [
    { view: AppView.HOME, icon: 'grid_view', label: 'Home' },
    { view: AppView.TRANSACTIONS, icon: 'history', label: 'History' },
    { isAction: true },
    { view: AppView.CATEGORIES, icon: 'label', label: 'Categories' },
    { view: AppView.VOICE_INPUT, icon: 'mic', label: 'AI Voice' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background-dark/80 backdrop-blur-2xl border-t border-white/[0.05] px-6 py-4 flex justify-between items-center z-50 max-w-md mx-auto h-20">
      {navItems.map((item, idx) => {
        if (item.isAction) {
          return (
            <button 
              key="quick-add"
              onClick={onQuickAdd}
              className="relative -top-10 size-16 bg-primary rounded-full text-black shadow-2xl shadow-primary/40 border-[4px] border-background-dark active:scale-90 transition-all flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-4xl font-black">add</span>
            </button>
          );
        }
        
        return (
          <button
            key={idx}
            onClick={() => onNavigate(item.view as AppView)}
            className={`flex flex-col items-center gap-1 transition-all ${
              currentView === item.view ? 'text-primary' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <span className={`material-symbols-outlined text-[24px] ${currentView === item.view ? 'fill-current font-black' : ''}`}>
              {item.icon}
            </span>
            <span className="text-[8px] font-black uppercase tracking-tighter">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
