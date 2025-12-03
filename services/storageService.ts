
import { User, AgentStats, AgentModule } from '../types';

const USER_STORAGE_KEY = 'matrix_user_session';
const AGENT_STORAGE_KEY = 'matrix_agent_data';

// User Session Management (Now using LocalStorage for better stability)
export const saveUserSession = (user: User) => {
    try {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
        console.error("Failed to save user session", e);
    }
};

export const loadUserSession = (): User | null => {
    const data = localStorage.getItem(USER_STORAGE_KEY);
    if (!data) return null;
    try {
        return JSON.parse(data);
    } catch (e) {
        return null;
    }
};

export const clearUserSession = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
};

// Agent Data Management (LocalStorage)
export interface SavedAgentData {
    name: string;
    class: string;
    stats: AgentStats;
    modules: AgentModule[];
    prompts: Record<string, string>;
    isJoined: boolean;
}

export const saveAgentData = (data: SavedAgentData) => {
    try {
        localStorage.setItem(AGENT_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.error("Failed to save agent data", e);
    }
};

export const loadAgentData = (): SavedAgentData | null => {
    const data = localStorage.getItem(AGENT_STORAGE_KEY);
    if (!data) return null;
    try {
        return JSON.parse(data);
    } catch (e) {
        return null;
    }
};

export const clearAgentData = () => {
    localStorage.removeItem(AGENT_STORAGE_KEY);
};
