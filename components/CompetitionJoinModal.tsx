import React, { useState } from 'react';
import { X, Trophy, Crown, Gift, Zap } from 'lucide-react';

interface CompetitionJoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: () => void;
  seasonStatus?: 'active' | 'pending' | 'ended';
}

const CompetitionJoinModal: React.FC<CompetitionJoinModalProps> = ({ isOpen, onClose, onJoin }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 modal-animate">
      <div className="w-full max-w-3xl bg-cp-black border border-cp-border shadow-2xl flex flex-col relative">
        
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors z-10">
            <X size={24} />
        </button>

        <div className="p-10 md:p-14 text-center">
            <div className="mb-6 inline-flex items-center justify-center w-16 h-16 border border-cp-yellow/50 rounded-full bg-cp-dark hover-card">
                <Trophy size={32} className="text-cp-yellow" strokeWidth={1} />
            </div>
            
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">
                Season 4: Philosopher's Stone
            </h2>
            <p className="text-cp-text-muted font-sans font-light text-lg mb-12 max-w-lg mx-auto">
                Join the global algorithmic warfare. Deploy your agent into the liquidity pool and compete for the Grand Prize.
            </p>

            <div className="grid grid-cols-3 gap-6 mb-12 border-t border-b border-cp-border py-8">
                <div className="flex flex-col items-center gap-2 hover-card p-2 border border-transparent">
                    <div className="text-xs font-bold uppercase tracking-widest text-gray-500">Rank 1 Prize</div>
                    <div className="text-2xl font-serif font-bold text-cp-yellow">¥500,000</div>
                </div>
                <div className="flex flex-col items-center gap-2 border-l border-r border-cp-border hover-card p-2 border-y-transparent">
                    <div className="text-xs font-bold uppercase tracking-widest text-gray-500">Participants</div>
                    <div className="text-2xl font-serif font-bold text-white">14,204</div>
                </div>
                <div className="flex flex-col items-center gap-2 hover-card p-2 border border-transparent">
                    <div className="text-xs font-bold uppercase tracking-widest text-gray-500">Ends In</div>
                    <div className="text-2xl font-serif font-bold text-white">14 Days</div>
                </div>
            </div>

            <button 
                onClick={onJoin}
                className="w-full md:w-auto px-16 py-4 btn-gold flex items-center justify-center gap-3 mx-auto"
            >
                <Zap size={18} /> ENTER COMPETITION
            </button>
            
            <button onClick={onClose} className="mt-6 text-xs text-gray-600 font-sans hover:text-white transition-colors uppercase tracking-widest">
                Continue in Local Mode
            </button>
        </div>
      </div>
    </div>
  );
};

export default CompetitionJoinModal;