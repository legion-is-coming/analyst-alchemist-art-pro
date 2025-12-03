import React from 'react';
import { X, FileText, Calendar, Share2, Printer } from 'lucide-react';

interface ArticleModalProps {
  article: { title: string; date: string; tag: string } | null;
  onClose: () => void;
}

const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-md bg-black/80 p-4 modal-animate">
      <div className="w-full max-w-3xl h-[80vh] bg-cp-black border border-cp-border flex flex-col shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cp-border bg-cp-dark shrink-0">
             <div className="flex items-center gap-3">
                <FileText className="text-cp-yellow" size={20} strokeWidth={1.5} />
                <span className="font-bold font-serif text-white uppercase tracking-wider">Research Report</span>
             </div>
             <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                 <X size={24} />
             </button>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar bg-cp-black flex-1">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6 leading-tight hover-card p-2 border border-transparent">{article.title}</h1>
            
            <div className="flex items-center gap-6 text-xs font-sans uppercase tracking-widest text-cp-text-muted mb-10 border-b border-cp-border pb-6 hover-card p-2 border border-transparent">
                <span>{article.date}</span>
                <span>TAG: {article.tag}</span>
                <span>AUTHOR: AI AGENT</span>
            </div>
            
            <div className="prose prose-invert prose-sm max-w-none font-serif text-cp-text-muted leading-loose">
                <div className="hover-card p-4 border border-transparent">
                  <p className="first-letter:text-4xl first-letter:font-bold first-letter:text-cp-yellow first-letter:float-left first-letter:mr-2">
                      Based on the latest liquidity analysis from the Matrix Neural Network, the {article.tag === '行业' ? 'Semiconductor' : 'Macro'} sector is approaching a critical pivot point. 
                      Institutional inflows have been detected across major indices, suggesting a shift in risk sentiment.
                  </p>
                </div>
                <h3 className="text-white font-bold mt-8 mb-4">Core Thesis</h3>
                <div className="hover-card p-4 border border-transparent">
                  <p>
                      Technical indicators suggest an oversold condition in key assets. The convergence of the 20-day and 50-day moving averages indicates potential for a breakout. 
                      However, volume remains a concern.
                  </p>
                </div>
                <div className="my-8 p-6 border border-cp-border bg-cp-dark/30 text-center font-mono text-xs hover-card">
                    [CHART PLACEHOLDER: VOLATILITY INDEX]
                </div>
                <h3 className="text-white font-bold mt-8 mb-4">Risk Factors</h3>
                <ul className="list-disc pl-4 space-y-2 hover-card p-4 border border-transparent">
                    <li>Global liquidity constraints</li>
                    <li>Unexpected regulatory shifts</li>
                </ul>
            </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-cp-border bg-cp-dark flex justify-end gap-4">
             <button className="px-6 py-2 btn-outline text-xs flex items-center gap-2">
                 <Printer size={14} /> PRINT
             </button>
             <button className="px-6 py-2 btn-gold text-xs flex items-center gap-2">
                 <Share2 size={14} /> SHARE
             </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleModal;