'use client';

import { useState } from 'react';
import { Check, Copy, Code2 } from 'lucide-react';

export default function CodePreviewBlock({ code, title }: { code: string, title?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card p-5 overflow-hidden col-span-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-cherry" />
          <h3 className="text-[#1B1716] font-semibold text-sm">React UI Code (MVP)</h3>
        </div>
        <button aria-label="Button action" type="button" 
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs font-medium text-[#1B1716]/60 hover:text-[#1B1716] transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy Code'}
        </button>
      </div>

      <div className="bg-[#1B1716] rounded-xl overflow-hidden shadow-2xl border border-[#1B1716]/10">
        {/* macOS Style Header */}
        <div className="bg-[#1B1716]/90 px-4 py-3 border-b border-white/5 flex items-center justify-between">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <span className="text-[10px] text-white/30 font-mono tracking-widest uppercase">{title || 'LandingPage.tsx'}</span>
          <div className="w-10"></div> {/* spacer to balance flex */}
        </div>
        
        {/* Code Content */}
        <div className="p-4 overflow-x-auto max-h-[500px] bg-[#12100F] custom-scrollbar">
          <pre className="text-sm font-mono text-[#EDEBDE]/90 leading-relaxed">
            <code>{code}</code>
          </pre>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-[#1B1716]/5">
         <p className="text-[#1B1716]/60 text-xs">This is a fully-functional React component using Tailwind CSS. You can copy and paste it directly into your Next.js or Vite project to instantly preview the generated UI.</p>
      </div>
    </div>
  );
}
