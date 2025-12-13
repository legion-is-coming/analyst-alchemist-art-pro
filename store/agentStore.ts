import { create } from 'zustand';
import type { AgentStats, AgentModule } from '@/types';

interface SavedAgentData {
  id: string | null;
  name: string;
  class: string;
  stats: AgentStats;
  modules: AgentModule[];
  prompts: Record<string, string>;
  isJoined: boolean;
  raw?: Record<string, unknown> | null;
}

interface AgentState {
  agentId: string | null;
  agentName: string | null;
  agentClass: string;
  agentRaw: Record<string, unknown> | null;
  agentStats: AgentStats;
  agentModules: AgentModule[];
  customPrompts: Record<string, string>;
  isJoinedCompetition: boolean;
  lastFetchedUserId: string | null;
  setAgentRaw: (raw: Record<string, unknown> | null) => void;
  setAgentName: (name: string | null) => void;
  setAgentClass: (cls: string) => void;
  setAgentStats: (stats: AgentStats) => void;
  setAgentModules: (modules: AgentModule[]) => void;
  setCustomPrompts: (prompts: Record<string, string>) => void;
  updateCustomPrompt: (capability: string, prompt: string) => void;
  setAgentId: (id: string | null) => void;
  setIsJoinedCompetition: (joined: boolean) => void;
  setLastFetchedUserId: (userId: string | null) => void;
  clearAgent: () => void;
  loadAgent: (data: SavedAgentData) => void;
}

export const useAgentStore = create<AgentState>()((set) => ({
  agentId: null,
  agentName: null,
  agentClass: '智能型',
  agentRaw: null,
  agentStats: { intelligence: 50, speed: 50, risk: 50 },
  agentModules: [],
  customPrompts: {},
  isJoinedCompetition: false,
  lastFetchedUserId: null,
  setAgentRaw: (raw) => set({ agentRaw: raw }),
  setAgentName: (name) => set({ agentName: name }),
  setAgentClass: (cls) => set({ agentClass: cls }),
  setAgentStats: (stats) => set({ agentStats: stats }),
  setAgentModules: (modules) => set({ agentModules: modules }),
  setCustomPrompts: (prompts) => set({ customPrompts: prompts }),
  updateCustomPrompt: (capability, prompt) =>
    set((state) => ({
      customPrompts: { ...state.customPrompts, [capability]: prompt }
    })),
  setAgentId: (id) => set({ agentId: id }),
  setIsJoinedCompetition: (joined) => set({ isJoinedCompetition: joined }),
  setLastFetchedUserId: (userId) => set({ lastFetchedUserId: userId }),
  clearAgent: () =>
    set({
      agentId: null,
      agentName: null,
      agentClass: '智能型',
      agentRaw: null,
      agentStats: { intelligence: 50, speed: 50, risk: 50 },
      agentModules: [],
      customPrompts: {},
      isJoinedCompetition: false,
      lastFetchedUserId: null
    }),
  loadAgent: (data) =>
    set({
      agentId: data.id,
      agentName: data.name,
      agentClass: data.class,
      agentRaw: data.raw ?? null,
      agentStats: data.stats,
      agentModules: data.modules,
      customPrompts: data.prompts,
      isJoinedCompetition: data.isJoined
    })
}));
