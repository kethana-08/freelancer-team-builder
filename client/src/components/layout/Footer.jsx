import React from 'react';
import { Layers, Sparkles, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-900 mt-auto py-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-slate-300">Freelancer Team Builder</span>
          <span>— Intelligent Assembly Platform</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 text-indigo-400 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            Priority-Weighted Matching Engine
          </span>
          <span>•</span>
          <span>Real-time Workspace Collaboration</span>
        </div>
      </div>
    </footer>
  );
};
