import React, { useState, useEffect } from 'react';
import { ViewState, ClothingItem, User } from '../types';
import { NavBar } from './NavBar';
import { InventoryView } from './InventoryView';
import { AddItem } from './AddItem';
import { StylistView } from './StylistView';
import { LogOut } from 'lucide-react';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [view, setView] = useState<ViewState>('wardrobe');
  
  // Storage key is now user-specific
  const storageKey = `smart-wardrobe-inventory-${user.username}`;

  // Initialize inventory from local storage
  const [inventory, setInventory] = useState<ClothingItem[]>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  // Persist inventory
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(inventory));
  }, [inventory, storageKey]);

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
              你好, {user.username}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
              {inventory.length} 件
            </div>
            <button 
              onClick={onLogout}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              title="退出登录"
            >
              <LogOut size={20} />
            </button>
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
