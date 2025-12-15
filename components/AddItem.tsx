import React, { useState, useRef } from 'react';
import { Camera, Upload, Check, RefreshCw } from 'lucide-react';
import { analyzeImageWithGemini } from '../services/geminiService';
import { ClothingItem, Category, Season } from '../types';
import { LOCATIONS, CATEGORIES, SEASONS } from '../constants';
import { Loading } from './Loading';

interface AddItemProps {
  onAdd: (item: ClothingItem) => void;
  onCancel: () => void;
}

export const AddItem: React.FC<AddItemProps> = ({ onAdd, onCancel }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [formData, setFormData] = useState<Partial<ClothingItem>>({
    name: '',
    category: Category.TOP,
    season: Season.ALL_SEASON,
    color: '',
    location: LOCATIONS[0],
    description: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setImage(base64);
        await analyzeImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (base64: string) => {
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeImageWithGemini(base64);
      setFormData(prev => ({ ...prev, ...analysis }));
    } catch (error) {
      alert("自动识别图片失败，请手动填写详情。");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return;

    const newItem: ClothingItem = {
      id: crypto.randomUUID(),
      imageUrl: image,
      name: formData.name || '未命名衣物',
      category: formData.category as Category,
      season: formData.season as Season,
      color: formData.color || '未知',
      location: formData.location || '未知',
      description: formData.description || '',
      createdAt: Date.now()
    };

    onAdd(newItem);
  };

  if (isAnalyzing) {
    return <Loading text="AI 正在识别您的衣物..." />;
  }

  return (
    <div className="pb-24">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">添加新衣物</h2>

      {!image ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 rounded-2xl h-64 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors"
        >
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 text-indigo-600">
            <Camera size={32} />
          </div>
          <p className="text-slate-600 font-medium">点击拍照或上传图片</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Preview */}
          <div className="relative h-64 rounded-2xl overflow-hidden shadow-md">
            <img src={image} alt="Preview" className="w-full h-full object-cover" />
            <button 
              type="button"
              onClick={() => { setImage(null); setFormData({}); }}
              className="absolute bottom-3 right-3 bg-white/90 text-slate-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm flex items-center"
            >
              <RefreshCw size={14} className="mr-2" /> 重拍
            </button>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">名称</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="例如：蓝色牛仔外套"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">类别</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value as Category })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">季节</label>
                <select
                  value={formData.season}
                  onChange={e => setFormData({ ...formData, season: e.target.value as Season })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">颜色</label>
              <input
                type="text"
                value={formData.color}
                onChange={e => setFormData({ ...formData, color: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="例如：藏青色"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-1">收纳位置 (在哪里?)</label>
              <select
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full p-3 bg-indigo-50 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-indigo-900"
              >
                {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center"
          >
            <Check className="mr-2" /> 保存到衣橱
          </button>
        </form>
      )}
    </div>
  );
};
