
import React, { useState } from 'react';
import { Category } from '../../types';

interface CategoryViewProps {
  categories: Category[];
  onAddCategory: (cat: Category) => void;
  onDeleteCategory: (id: string) => void;
  onEditCategory: (cat: Category) => void;
}

const COLORS = ['#3b82f6', '#10b981', '#6366f1', '#f59e0b', '#ef4444', '#a855f7', '#ec4899', '#f97316'];
const ICONS = ['restaurant', 'commute', 'shopping_bag', 'movie', 'home', 'bolt', 'medication', 'school', 'fitness_center', 'subscriptions', 'pets', 'work'];

const CategoryView: React.FC<CategoryViewProps> = ({ categories, onAddCategory, onDeleteCategory, onEditCategory }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  
  const [name, setName] = useState('');
  const [limit, setLimit] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);

  const handleSave = () => {
    if (!name) return;
    
    if (editingCatId) {
      onEditCategory({
        id: editingCatId,
        name,
        icon: selectedIcon,
        color: selectedColor,
        limit: parseFloat(limit) || undefined,
        type: 'expense'
      });
    } else {
      onAddCategory({
        id: Math.random().toString(36).substr(2, 9),
        name,
        icon: selectedIcon,
        color: selectedColor,
        limit: parseFloat(limit) || undefined,
        type: 'expense'
      });
    }
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setLimit('');
    setSelectedColor(COLORS[0]);
    setSelectedIcon(ICONS[0]);
    setIsAdding(false);
    setEditingCatId(null);
  };

  const startEdit = (cat: Category) => {
    setEditingCatId(cat.id);
    setName(cat.name);
    setLimit(cat.limit?.toString() || '');
    setSelectedColor(cat.color);
    setSelectedIcon(cat.icon);
    setIsAdding(true);
  };

  return (
    <div className="px-6 pt-10 flex flex-col gap-8 min-h-screen pb-32">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-black tracking-tighter text-white">Categories</h2>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="size-10 rounded-full bg-primary text-black flex items-center justify-center shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined font-black">add</span>
          </button>
        )}
      </header>

      {isAdding && (
        <div className="p-8 bg-neutral-900 border border-primary/20 rounded-[40px] flex flex-col gap-6 animate-in slide-in-from-top duration-500 shadow-2xl z-20">
          <input 
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name..."
            className="w-full bg-transparent border-none p-0 text-2xl font-black focus:ring-0 placeholder-neutral-700 text-white"
          />
          
          <div className="flex items-center gap-3">
             <span className="text-neutral-500 font-black uppercase text-[10px] tracking-widest">Monthly Limit</span>
             <input 
               value={limit}
               onChange={e => setLimit(e.target.value)}
               placeholder="ARS (Optional)"
               className="flex-1 bg-transparent border-none p-0 font-black focus:ring-0 text-sm text-white"
               type="number"
             />
          </div>

          <div>
             <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-3">Pick Icon</p>
             <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto hide-scrollbar">
                {ICONS.map(i => (
                  <button 
                    key={i}
                    onClick={() => setSelectedIcon(i)}
                    className={`size-10 rounded-xl flex items-center justify-center transition-all ${selectedIcon === i ? 'bg-primary text-black' : 'bg-white/5 text-neutral-500'}`}
                  >
                    <span className="material-symbols-outlined text-sm">{i}</span>
                  </button>
                ))}
             </div>
          </div>

          <div>
             <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-3">Color Accent</p>
             <div className="flex flex-wrap gap-3">
                {COLORS.map(c => (
                  <button 
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`size-6 rounded-full border-2 ${selectedColor === c ? 'border-white scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
             </div>
          </div>

          <div className="flex gap-2 pt-4">
            <button onClick={handleSave} className="flex-1 py-4 bg-primary text-black font-black rounded-2xl uppercase tracking-widest text-xs">
              {editingCatId ? 'Update' : 'Save Category'}
            </button>
            <button onClick={resetForm} className="px-6 py-4 bg-white/5 text-white font-black rounded-2xl uppercase tracking-widest text-xs">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {categories.map(cat => (
          <div key={cat.id} className="p-5 bg-neutral-900/40 border border-white/5 rounded-[32px] flex flex-col gap-4 group hover:border-white/10 transition-all relative">
             <div className="flex justify-between items-start">
               <div className="size-12 rounded-2xl flex items-center justify-center border border-white/5" style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>
                  <span className="material-symbols-outlined">{cat.icon}</span>
               </div>
               <div className="flex flex-col gap-2">
                 <button onClick={() => startEdit(cat)} className="size-8 rounded-full bg-white/5 flex items-center justify-center text-neutral-500 hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-xs">edit</span>
                 </button>
                 <button onClick={() => onDeleteCategory(cat.id)} className="size-8 rounded-full bg-danger/10 flex items-center justify-center text-danger/60 hover:text-danger transition-colors">
                    <span className="material-symbols-outlined text-xs">delete</span>
                 </button>
               </div>
             </div>
             <div>
                <p className="font-black text-xs text-white uppercase tracking-tight">{cat.name}</p>
                {cat.limit ? (
                   <p className="text-[9px] text-neutral-500 font-black uppercase tracking-tighter mt-1">Limit: ${cat.limit.toLocaleString()} ARS</p>
                ) : (
                   <p className="text-[9px] text-neutral-600 font-bold uppercase tracking-tighter mt-1">Unlimited</p>
                )}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryView;
