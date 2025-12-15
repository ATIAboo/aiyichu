import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  text?: string;
}

export const Loading: React.FC<LoadingProps> = ({ text = "正在处理中..." }) => (
  <div className="flex flex-col items-center justify-center p-8 space-y-4">
    <Loader2 className="animate-spin text-indigo-600" size={48} />
    <p className="text-slate-600 font-medium animate-pulse">{text}</p>
  </div>
);
