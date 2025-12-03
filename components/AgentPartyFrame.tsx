
import React from 'react';
import { Activity, Crosshair, Search, Rewind, PenTool, Cpu, Settings, MessageSquare, Trash2, SignalHigh, LogIn, Trophy, TrendingUp, Edit2, Brain, ChevronRight, User } from 'lucide-react';
import { AgentCapability, AgentStats, AgentModule } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface AgentPartyFrameProps {
  agentName: string;
  agentClass?: string;
  agentLevel?: number;
  agentStats?: AgentStats;
  agentModules?: AgentModule[];
  isJoined?: boolean;
  rank?: number;
  profit?: string;
  onToggleJoin?: () => void;
  onSelectCapability: (cap: AgentCapability) => void;
  onEditCapability: (cap: AgentCapability) => void;
  onEditAgent?: () => void;
  onOpenChat: () => void;
  onDeleteAgent: () => void;
}

const AgentPartyFrame: React.FC<AgentPartyFrameProps> = ({ 
    agentName, 
    agentClass = "智能型", 
    agentLevel = 1,
    isJoined = false,
    rank,
    profit,
    onToggleJoin,
    onSelectCapability, 
    onEditCapability, 
    onEditAgent,
    onOpenChat,
    onDeleteAgent
}) => {
  const { t } = useLanguage();
  
  const renderMember = (cap: AgentCapability) => {
    const label = t(`capabilities.${cap}.label`);
    const desc = t(`capabilities.${cap}.desc`);

    const Icon = {
      [AgentCapability.AUTO_TRADING]: Activity,
      [AgentCapability.STRATEGY_PICKING]: Crosshair,
      [AgentCapability.STOCK_ANALYSIS]: Search,
      [AgentCapability.BACKTESTING]: Rewind,
      [AgentCapability.ARTICLE_WRITING]: PenTool
    }[cap];

    return (
      <div 
        key={cap}
        className="group relative flex items-center p-3 border-b border-cp-border/30 hover:bg-cp-dark/30 transition-all duration-200 cursor-pointer min-h-[64px]"
        onClick={() => { onSelectCapability(cap); }}
      >
        <div className="w-10 h-10 flex shrink-0 items-center justify-center text-cp-text-muted group-hover:text-cp-yellow transition-colors border border-cp-border bg-cp-black mr-4 shadow-sm">
            <Icon size={18} strokeWidth={1.5} />
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center">
            <h4 className="font-bold text-cp-text text-sm tracking-wide group-hover:text-white transition-colors truncate flex items-center gap-2">
                {label}
            </h4>
            <p className="text-[10px] text-cp-text-muted mt-0.5 truncate opacity-70 font-sans">
                {desc}
            </p>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onEditCapability(cap);
                }}
                className="p-2 text-cp-text-muted hover:text-white transition-colors"
                title="编辑指令"
            >
                <Settings size={14} />
            </button>
             <button 
                className="p-2 text-cp-text-muted hover:text-cp-yellow transition-colors"
            >
                <ChevronRight size={14} />
            </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full h-full bg-cp-black">
      
      {/* Super Compact Header - Lowered border visibility */}
      <div className="shrink-0 bg-cp-dark border-b border-cp-border/50 p-4">
          <div className="flex items-center gap-3 mb-3">
               {/* Small Avatar */}
               <div className="w-8 h-8 border border-cp-yellow/50 bg-cp-black flex items-center justify-center shadow-[0_0_10px_rgba(197,160,89,0.2)] shrink-0">
                    <Cpu size={16} className="text-cp-yellow" strokeWidth={1.5} />
               </div>
               
               <div className="min-w-0 flex-1">
                   <div className="flex items-baseline justify-between">
                        <h3 className="text-cp-text font-bold text-sm tracking-wide truncate pr-2">
                            {agentName}
                        </h3>
                        <span className="text-[10px] text-cp-cyan font-bold uppercase tracking-widest shrink-0">{agentClass}</span>
                   </div>
                   <div className="flex items-center gap-3 text-[10px] font-mono text-cp-text-muted mt-0.5">
                        <span>LV.{agentLevel}</span>
                        <span className="text-gray-600">|</span>
                        <span className={isJoined ? "text-cp-yellow" : "text-gray-500"}>{isJoined ? "ONLINE" : "OFFLINE"}</span>
                   </div>
               </div>
          </div>

          {/* Stats Row - Integrated Compactly */}
          <div className="flex items-stretch h-8 border border-cp-border bg-cp-black">
               <div className="flex-1 flex items-center justify-center gap-2 border-r border-cp-border">
                    <span className="text-[9px] text-gray-500 uppercase font-bold">排名</span>
                    <span className="text-xs font-bold text-white font-mono">{isJoined ? `#${rank ?? '-'}` : '--'}</span>
               </div>
               <div className="flex-1 flex items-center justify-center gap-2 border-r border-cp-border">
                    <span className="text-[9px] text-gray-500 uppercase font-bold">收益</span>
                    <span className={`text-xs font-bold font-mono ${profit?.startsWith('+') ? 'text-cp-yellow' : 'text-cp-text-muted'}`}>
                        {isJoined ? profit : '--'}
                    </span>
               </div>
               <button 
                    onClick={onToggleJoin}
                    className={`px-3 flex items-center justify-center gap-1 text-[9px] font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors
                        ${isJoined ? 'bg-cp-dark text-cp-text-muted' : 'bg-cp-yellow text-black'}
                    `}
               >
                   {isJoined ? '退赛' : '参赛'}
               </button>
          </div>

           {/* Quick Actions */}
           <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-cp-border/30">
                <button onClick={onOpenChat} className="text-[10px] flex items-center gap-1 text-cp-text-muted hover:text-cp-yellow transition-colors px-2 py-1">
                    <MessageSquare size={12}/> 通讯
                </button>
                <button onClick={onEditAgent} className="text-[10px] flex items-center gap-1 text-cp-text-muted hover:text-white transition-colors px-2 py-1">
                    <Edit2 size={12}/> 重构
                </button>
                <button onClick={onDeleteAgent} className="text-[10px] flex items-center gap-1 text-cp-text-muted hover:text-cp-red transition-colors px-2 py-1">
                    <Trash2 size={12}/> 销毁
                </button>
           </div>
      </div>
      
      {/* Capabilities List - Maximized Space */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-cp-black flex flex-col">
        <div className="px-4 py-2 text-[10px] font-bold text-cp-text-muted uppercase tracking-widest bg-cp-black/50 border-b border-cp-border/30 sticky top-0 backdrop-blur-sm z-10 flex justify-between">
            <span>技能矩阵</span>
            <span>{Object.keys(AgentCapability).length} MODULES</span>
        </div>
        <div className="flex flex-col">
             {Object.values(AgentCapability).map(renderMember)}
        </div>
        
        {/* Fill remaining space visually */}
        <div className="flex-1 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 min-h-[50px]"></div>
      </div>
    </div>
  );
};

export default AgentPartyFrame;
