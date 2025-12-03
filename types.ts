
export enum AgentCapability {
  AUTO_TRADING = 'AUTO_TRADING',
  STRATEGY_PICKING = 'STRATEGY_PICKING',
  STOCK_ANALYSIS = 'STOCK_ANALYSIS',
  BACKTESTING = 'BACKTESTING',
  ARTICLE_WRITING = 'ARTICLE_WRITING'
}

export interface User {
  id: string;
  username: string;
  email?: string;
  faction?: 'CORPO' | 'NOMAD' | 'NETRUNNER';
  level: number;
  achievements: Achievement[];
  avatarFrame: string;
}

export interface Achievement {
  id: string;
  name: string;
  icon: string;
  unlocked: boolean;
}

export interface AgentStats {
  intelligence: number; // Renamed to Strategy Capability in UI
  speed: number;        // Renamed to Execution Efficiency in UI
  risk: number;         // Renamed to Stability/Robustness in UI
}

// New: Module Definition for Team Assembly
export interface AgentModule {
    id: string;
    type: 'CORE' | 'EXECUTION' | 'RISK';
    name: string;
    description: string;
    statsMod: Partial<AgentStats>;
    icon: string;
}

export interface Agent {
  id: string;
  name: string;
  class: string; // e.g., "NetRunner", "Corporate", "Street Kid"
  modules: AgentModule[]; // Composition
  level: number;
  exp: number;
  nextLevelExp: number;
  stats: AgentStats;
  rank: number;
  returns: number;
  status: 'active' | 'idle' | 'error';
}

export interface RankingItem {
  id: number | string;
  rank: number;
  name: string;
  class: string; 
  profit: string;
  rawProfit: number; // Numeric value for sorting
  status: '在线' | '离线' | '训练中';
  badges?: string[];
  isUser?: boolean; // Identify if this is the user's agent
}

export interface ChartDataPoint {
  time: string;
  [agentId: string]: number | string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'market';
  timestamp: number;
}

export const AGENT_CAPABILITY_DETAILS: Record<AgentCapability, { label: string; icon: string; desc: string; role: string }> = {
  [AgentCapability.AUTO_TRADING]: { 
    label: '自动交易', 
    icon: 'activity', 
    desc: '低买高卖，自动赚钱',
    role: '交易员'
  },
  [AgentCapability.STRATEGY_PICKING]: { 
    label: '智能选股', 
    icon: 'crosshair', 
    desc: '挖掘潜力牛股',
    role: '策略师'
  },
  [AgentCapability.STOCK_ANALYSIS]: { 
    label: '个股诊断', 
    icon: 'search', 
    desc: '分析股票好坏',
    role: '分析师'
  },
  [AgentCapability.BACKTESTING]: { 
    label: '历史验证', 
    icon: 'rewind', 
    desc: '用历史数据测试',
    role: '精算师'
  },
  [AgentCapability.ARTICLE_WRITING]: { 
    label: '生成报告', 
    icon: 'pen-tool', 
    desc: '自动写复盘总结',
    role: '研究员'
  }
};