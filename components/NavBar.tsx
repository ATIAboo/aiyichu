import React from 'react';
import { ViewState } from '../types';
import { Shirt, PlusCircle, Sparkles } from 'lucide-react';

interface NavBarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

export const NavBar: React.FC<NavBarProps> = ({ currentView, setView }) => {
  const navItemClass = (view: ViewState) =>
    `flex flex-col items-center justify-center w-full h-full space-y-1 ${
      currentView === view ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
    }`;

  return (
    <div className="fixed bottom-0 left-0 w-full h-16 bg-white border-t border-slate-200 flex justify-around items-center z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <button onClick={() => setView('wardrobe')} className={navItemClass('wardrobe')}>
        <Shirt size={24} strokeWidth={currentView === 'wardrobe' ? 2.5 : 2} />
        <span className="text-xs font-medium">衣橱</span>
      </button>

      <button onClick={() => setView('add')} className={navItemClass('add')}>
        <PlusCircle size={32} strokeWidth={currentView === 'add' ? 2.5 : 2} className="mb-1" />
        <span className="text-xs font-medium">添加</span>
      </button>

      <button onClick={() => setView('stylist')} className={navItemClass('stylist')}>
        <Sparkles size={24} strokeWidth={currentView === 'stylist' ? 2.5 : 2} />
        <span className="text-xs font-medium">搭配师</span>
      </button>
    </div>
  );
};
