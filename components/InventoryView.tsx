import React, { useState, useMemo } from 'react';
import { ClothingItem, Category, Season } from '../types';
import { Trash2, MapPin, Search } from 'lucide-react';
import { CATEGORIES } from '../constants';

interface InventoryViewProps {
  items: ClothingItem[];
  onDelete: (id: string) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({ items, onDelete }) => {
  const [filterCategory, setFilterCategory] = useState<string>('全部');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesCategory = filterCategory === '全部' || item.category === filterCategory;
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(term) ||
        item.location.toLowerCase().includes(term) ||
        item.color.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [items, filterCategory, searchTerm]);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
          <MapPin className="text-indigo-400" size={40} />
        </div>
        <h3 className="text-xl font-semibold text-slate-800">衣橱是空的</h3>
        <p className="text-slate-500 mt-2 max-w-xs">
          开始添加衣物来整理您的衣橱，并获取 AI 穿搭建议。
        </p>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-2">
      {/* Search & Filter Header */}
      <div className="sticky top-0 bg-slate-50/95 backdrop-blur-sm z-10 py-2 space-y-3 px-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="搜索衣物、颜色或位置..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setFilterCategory('全部')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filterCategory === '全部'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            全部
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filterCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 relative group">
            <div className="aspect-square bg-slate-100 relative overflow-hidden">
               <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    title="删除"
                  >
                    <Trash2 size={16} />
                  </button>
               </div>
            </div>
            <div className="p-3">
              <h4 className="font-semibold text-slate-800 text-sm truncate">{item.name}</h4>
              <div className="flex items-center text-xs text-slate-500 mt-1">
                <MapPin size={12} className="mr-1" />
                <span className="truncate">{item.location}</span>
              </div>
              <div className="mt-2 flex gap-1 flex-wrap">
                <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                  {item.category}
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md">
                  {item.season}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredItems.length === 0 && (
         <div className="text-center py-12 text-slate-400">
            没有找到匹配的衣物。
         </div>
      )}
    </div>
  );
};
