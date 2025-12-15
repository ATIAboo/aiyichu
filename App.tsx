import React, { useState, useEffect } from 'react';
import { ViewState, ClothingItem } from './types';
import { NavBar } from './components/NavBar';
import { InventoryView } from './components/InventoryView';
import { AddItem } from './components/AddItem';
import { StylistView } from './components/StylistView';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('wardrobe');
  
  // Initialize inventory from local storage
  const [inventory, setInventory] = useState<ClothingItem[]>(() => {
    const saved = localStorage.getItem('smart-wardrobe-inventory');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist inventory
  useEffect(() => {
    localStorage.setItem('smart-wardrobe-inventory', JSON.stringify(inventory));
  }, [inventory]);

  const handleAddItem = (item: ClothingItem) => {
    setInventory(prev => [item, ...prev]);
    setView('wardrobe');
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm("确定要删除这件衣物吗？")) {
      setInventory(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      <div className="max-w-md mx-auto min-h-screen relative bg-white sm:shadow-2xl sm:border-x sm:border-slate-100">
        
        {/* Header */}
        <header className="px-6 pt-8 pb-2 flex justify-between items-center bg-white">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              智能<span className="text-indigo-600">衣橱 AI</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">
              您的贴身搭配师
            </p>
          </div>
          <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
            {inventory.length} 件衣物
          </div>
        </header>

        {/* Main Content */}
        <main className="px-4 mt-2">
          {view === 'wardrobe' && (
            <InventoryView items={inventory} onDelete={handleDeleteItem} />
          )}
          
          {view === 'add' && (
            <AddItem onAdd={handleAddItem} onCancel={() => setView('wardrobe')} />
          )}

          {view === 'stylist' && (
            <StylistView inventory={inventory} />
          )}
        </main>

        {/* Navigation */}
        <NavBar currentView={view} setView={setView} />
      </div>
    </div>
  );
};

export default App;
