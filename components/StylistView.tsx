import React, { useState } from 'react';
import { ClothingItem, OutfitSuggestion } from '../types';
import { suggestOutfitWithGemini, generateOutfitVisualization } from '../services/geminiService';
import { Sparkles, Sun, CloudRain, Calendar, Wind, Eye, ImageIcon } from 'lucide-react';
import { Loading } from './Loading';

interface StylistViewProps {
  inventory: ClothingItem[];
}

export const StylistView: React.FC<StylistViewProps> = ({ inventory }) => {
  const [weather, setWeather] = useState('');
  const [occasion, setOccasion] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [suggestion, setSuggestion] = useState<OutfitSuggestion | null>(null);
  const [visualizationUrl, setVisualizationUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (inventory.length < 2) {
      alert("衣橱里的衣服太少了，AI 搭配师需要更多选择！");
      return;
    }
    if (!weather || !occasion) {
      alert("请输入天气和场合。");
      return;
    }

    setIsGenerating(true);
    setSuggestion(null);
    setVisualizationUrl(null);

    try {
      const result = await suggestOutfitWithGemini(inventory, occasion, weather);
      setSuggestion(result);
    } catch (error) {
      alert("获取建议失败，请尝试其他关键词。");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVisualize = async () => {
    if (!suggestion) return;
    const items = getSuggestedItems();
    if (items.length === 0) return;

    setIsVisualizing(true);
    try {
      const url = await generateOutfitVisualization(items);
      setVisualizationUrl(url);
    } catch (error) {
      console.error(error);
      alert("无法生成试穿效果，请稍后重试。");
    } finally {
      setIsVisualizing(false);
    }
  };

  const getSuggestedItems = () => {
    if (!suggestion) return [];
    return inventory.filter(item => suggestion.items.includes(item.id));
  };

  const suggestedItems = getSuggestedItems();

  if (isGenerating) {
    return <Loading text="搭配师正在为您挑选..." />;
  }

  return (
    <div className="pb-24">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">AI 搭配师</h2>
        <p className="text-slate-500 text-sm">告诉我今天的安排，我来为您搭配。</p>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-5 mb-8">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
            <Sun size={16} className="mr-2 text-orange-500" /> 天气
          </label>
          <div className="grid grid-cols-2 gap-2">
            {['晴朗炎热', '凉爽微风', '下雨天', '寒冷冬季'].map(w => (
              <button
                key={w}
                onClick={() => setWeather(w)}
                className={`text-sm py-2 px-3 rounded-lg border transition-all ${
                  weather === w
                    ? 'bg-orange-50 border-orange-200 text-orange-700 font-medium'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {w}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={weather}
            onChange={(e) => setWeather(e.target.value)}
            placeholder="或输入自定义 (例如: 25°C, 大风)"
            className="w-full mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
            <Calendar size={16} className="mr-2 text-purple-500" /> 场合
          </label>
          <div className="grid grid-cols-2 gap-2">
            {['工作/办公', '休闲约会', '健身/运动', '派对聚会'].map(o => (
              <button
                key={o}
                onClick={() => setOccasion(o)}
                className={`text-sm py-2 px-3 rounded-lg border transition-all ${
                  occasion === o
                    ? 'bg-purple-50 border-purple-200 text-purple-700 font-medium'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {o}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            placeholder="或输入自定义 (例如: 婚礼, 野餐)"
            className="w-full mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={!weather || !occasion}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
        >
          <Sparkles className="mr-2" size={18} /> 获取搭配建议
        </button>
      </div>

      {suggestion && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl mb-6">
            <h3 className="text-xl font-bold mb-1">{suggestion.outfitName}</h3>
            <p className="text-indigo-100 text-sm leading-relaxed opacity-90">{suggestion.reasoning}</p>
          </div>

          <div className="flex justify-between items-center mb-3 px-1">
             <h4 className="font-semibold text-slate-700">精选单品</h4>
             {!visualizationUrl && !isVisualizing && (
               <button 
                onClick={handleVisualize}
                className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full font-medium flex items-center hover:bg-indigo-100 transition-colors"
               >
                 <Eye size={14} className="mr-1.5" /> 试穿效果预览
               </button>
             )}
          </div>

          {isVisualizing && (
            <div className="mb-6 bg-slate-50 rounded-2xl p-8 flex flex-col items-center justify-center border border-slate-200">
              <Loading text="正在生成上身效果图..." />
            </div>
          )}

          {visualizationUrl && (
             <div className="mb-6 rounded-2xl overflow-hidden shadow-lg border border-slate-100">
                <div className="bg-slate-800 text-white text-xs py-1 px-3 flex items-center">
                  <ImageIcon size={12} className="mr-2" /> AI 生成试穿效果
                </div>
                <img src={visualizationUrl} alt="Outfit Visualization" className="w-full h-auto" />
             </div>
          )}

          <div className="space-y-3">
            {suggestedItems.map(item => (
              <div key={item.id} className="flex bg-white p-3 rounded-xl border border-slate-100 shadow-sm items-center">
                <div className="h-16 w-16 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                  <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="ml-4 flex-1">
                  <h5 className="font-semibold text-slate-800">{item.name}</h5>
                  <p className="text-xs text-slate-500 mt-0.5">位置: <span className="font-medium text-indigo-600">{item.location}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};