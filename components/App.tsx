import React, { useState, useEffect, useRef } from 'react';
import MatrixRain from './MatrixRain';
import EquityChart from './EquityChart';
import AgentPartyFrame from './AgentPartyFrame';
import RankingList from './RankingList';
import ChatWidget from './ChatWidget';
import CapabilityModal from './CapabilityModal';
import CreateAgentModal from './CreateAgentModal';
import EditAgentModal from './EditAgentModal';
import PromptEditModal from './PromptEditModal';
import CompetitionInviteCard from './CompetitionInviteCard';
import ExternalAgentModal from './ExternalAgentModal';
import LoginScreen from './LoginScreen';
import SeasonInfoPanel from './SeasonInfoPanel';
import SeasonPassModal from './SeasonPassModal';
import ConfirmModal from './ConfirmModal';
import NotificationSystem from './NotificationSystem';
import LandingPage from './LandingPage';
import ArticleModal from './ArticleModal';
import NotificationHistoryModal from './NotificationHistoryModal';
import CompetitionJoinModal from './CompetitionJoinModal';
import { ChartDataPoint, AgentCapability, User, AgentStats, AgentModule, RankingItem, AppNotification, AGENT_CAPABILITY_DETAILS } from '../types';
import { Hexagon, Activity, User as UserIcon, LogOut, LogIn, Trophy, Sun, Moon, Users, Bell, Languages } from 'lucide-react';
import { loadUserSession, saveUserSession, clearUserSession, loadAgentData, saveAgentData, clearAgentData, SavedAgentData } from '../services/storageService';
import { useLanguage } from '../contexts/LanguageContext';

// Initial Bots Configuration
const INITIAL_BOTS: RankingItem[] = [
    { id: 101, rank: 1, name: "北向掘金者", class: 'Quant', profit: "+0.0%", rawProfit: 100, status: '在线', badges: ['legend', 'whale'] },
    { id: 102, rank: 2, name: "龙虎榜一哥", class: 'Scalper', profit: "+0.0%", rawProfit: 100, status: '在线', badges: ['quant'] },
    { id: 103, rank: 3, name: "价值发现AI", class: 'Quant', profit: "+0.0%", rawProfit: 100, status: '在线' },
    { id: 104, rank: 4, name: "超短情绪流", class: 'Scalper', profit: "+0.0%", rawProfit: 100, status: '训练中', badges: ['risk'] },
    { id: 105, rank: 5, name: "国企改革策略", class: 'Corpo', profit: "+0.0%", rawProfit: 100, status: '离线' },
    { id: 106, rank: 6, name: "深市成长猎手", class: 'NetRunner', profit: "+0.0%", rawProfit: 100, status: '在线' },
    { id: 107, rank: 7, name: "可转债套利", class: 'Quant', profit: "+0.0%", rawProfit: 100, status: '在线' },
    { id: 108, rank: 8, name: "红利低波bot", class: 'Whale', profit: "+0.0%", rawProfit: 100, status: '在线' },
    { id: 109, rank: 9, name: "打板核按钮", class: 'Scalper', profit: "+0.0%", rawProfit: 100, status: '训练中' },
    { id: 110, rank: 10, name: "微盘股指增", class: 'NetRunner', profit: "+0.0%", rawProfit: 100, status: '在线' },
];

const App: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();

  // Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [showLanding, setShowLanding] = useState(true);

  // User State (Account)
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // Agent State (Character)
  const [agentName, setAgentName] = useState<string | null>(null);
  const [agentClass, setAgentClass] = useState<string>("智能型");
  const [agentStats, setAgentStats] = useState<AgentStats>({ intelligence: 50, speed: 50, risk: 50 });
  const [agentModules, setAgentModules] = useState<AgentModule[]>([]);
  
  // Competition State
  const [isJoinedCompetition, setIsJoinedCompetition] = useState(false);

  // App UI State
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [rankingList, setRankingList] = useState<RankingItem[]>(INITIAL_BOTS);
  
  // Refs for Simulation
  const competitorsRef = useRef<RankingItem[]>(INITIAL_BOTS);
  const currentUserRef = useRef<User | null>(null);

  const [selectedCapability, setSelectedCapability] = useState<AgentCapability | null>(null);
  const [highlightedAgent, setHighlightedAgent] = useState<string | null>(null);
  const [inspectingAgent, setInspectingAgent] = useState<string | null>(null);
  const [customPrompts, setCustomPrompts] = useState<Record<string, string>>({});
  const [editingCapability, setEditingCapability] = useState<AgentCapability | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isEditAgentOpen, setIsEditAgentOpen] = useState(false);
  
  // Notification State
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [notificationHistory, setNotificationHistory] = useState<AppNotification[]>([]);
  const [isNotifHistoryOpen, setIsNotifHistoryOpen] = useState(false);

  // Article View State
  const [readingArticle, setReadingArticle] = useState<any | null>(null);
  
  // Sidebar Tab State
  const [activeSideTab, setActiveSideTab] = useState<'MY_AGENT' | 'RANKING'>('MY_AGENT');
  
  // Mobile View State
  const [mobileView, setMobileView] = useState<'MARKET' | 'SIDEBAR'>('MARKET');

  // Modals & Flow State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSeasonPassOpen, setIsSeasonPassOpen] = useState(false);
  const [isJoinCompetitionModalOpen, setIsJoinCompetitionModalOpen] = useState(false);
  
  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, title: string, message: string, action: () => void}>({
    isOpen: false,
    title: '',
    message: '',
    action: () => {}
  });

  const [pendingAction, setPendingAction] = useState<'createAgent' | null>(null);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  useEffect(() => {
    const savedUser = loadUserSession();
    if (savedUser) {
        setCurrentUser(savedUser);
    }
  }, []);

  useEffect(() => {
    const savedAgent = loadAgentData();
    if (savedAgent) {
        setAgentName(savedAgent.name);
        setAgentClass(savedAgent.class);
        setAgentStats(savedAgent.stats);
        setAgentModules(savedAgent.modules);
        setCustomPrompts(savedAgent.prompts);
        setIsJoinedCompetition(savedAgent.isJoined);

        if (savedAgent.isJoined) {
            const userAgent: RankingItem = {
                id: 'user_agent',
                rank: 999, 
                name: savedAgent.name,
                class: savedAgent.class === '趋势达人' || savedAgent.class === '抄底专家' || savedAgent.class === 'AI 预测' ? 'Quant' : 'NetRunner',
                profit: "+0.0%",
                rawProfit: 0,
                status: '在线',
                isUser: true,
                badges: ['legend']
            };
            
            if (!competitorsRef.current.some(c => c.isUser)) {
                competitorsRef.current = [...competitorsRef.current, userAgent];
                 setChartData(prev => {
                    const last = prev[prev.length - 1];
                    if (last) {
                        const newLast = {...last};
                        newLast[savedAgent.name] = 100;
                        return [...prev.slice(0, -1), newLast];
                    }
                    return prev;
                });
            }
        }
    }
  }, []);

  useEffect(() => {
    if (agentName) {
        const dataToSave: SavedAgentData = {
            name: agentName,
            class: agentClass,
            stats: agentStats,
            modules: agentModules,
            prompts: customPrompts,
            isJoined: isJoinedCompetition
        };
        saveAgentData(dataToSave);
    }
  }, [agentName, agentClass, agentStats, agentModules, customPrompts, isJoinedCompetition]);


  const toggleTheme = () => {
      const newTheme = theme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      if (newTheme === 'light') {
          document.documentElement.classList.add('light-mode');
      } else {
          document.documentElement.classList.remove('light-mode');
      }
  };

  const addNotification = (title: string, message: string, type: AppNotification['type'] = 'info') => {
      const newNote: AppNotification = {
          id: Math.random().toString(36).substr(2, 9),
          title,
          message,
          type,
          timestamp: Date.now()
      };
      setNotifications(prev => [newNote, ...prev].slice(0, 5)); 
      
      setNotificationHistory(prev => [newNote, ...prev].slice(0, 50)); 

      setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== newNote.id));
      }, 5000);
  };

  const handleDismissNotification = (id: string) => {
      setNotifications(prev => prev.filter(n => n.id !== id));
  };

  useEffect(() => {
    const data: ChartDataPoint[] = [];
    const startTime = new Date().setHours(9, 30, 0, 0);
    
    let currentValues: Record<string, number> = {};
    competitorsRef.current.forEach(comp => {
        currentValues[comp.name] = 100; 
    });

    for (let i = 0; i < 50; i++) {
      const time = new Date(startTime + i * 1000 * 60 * 5);
      const point: ChartDataPoint = {
          time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      Object.keys(currentValues).forEach(key => {
         const change = (Math.random() - 0.48) * 2; 
         currentValues[key] = currentValues[key] + change;
         point[key] = parseFloat(currentValues[key].toFixed(2));
      });
      data.push(point);
    }
    setChartData(data);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.96 && currentUserRef.current) { 
          const events = [
              { title: "市场突发", msg: "半导体板块出现大额资金净流入，指数拉升。", type: 'market' },
              { title: "系统公告", msg: "检测到 '北向掘金者' 策略异常，已触发熔断保护。", type: 'warning' },
              { title: "宏观快讯", msg: "央行发布最新流动性报告，市场情绪指数上升。", type: 'info' },
              { title: "交易异动", msg: "发现机构席位大宗交易，涉及金额 5.2 亿。", type: 'market' },
              { title: "赛季速报", msg: "排位赛竞争激烈，Top 10 名单已刷新。", type: 'info' }
          ];
          const evt = events[Math.floor(Math.random() * events.length)];
          addNotification(evt.title, evt.msg, evt.type as any);
      }

      setChartData(prev => {
        const last = prev[prev.length - 1];
        if (!last) return prev;
        
        const nextTime = new Date();
        const newDataPoint: ChartDataPoint = {
          time: nextTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        const currentCompetitors = competitorsRef.current;
        
        currentCompetitors.forEach(comp => {
            const lastVal = (last[comp.name] as number) || 100;
            const volatility = comp.isUser ? 3.5 : 2.5; 
            const change = (Math.random() - 0.45) * volatility;
            newDataPoint[comp.name] = parseFloat((lastVal + change).toFixed(2));
        });

        const newHistory = [...prev.slice(prev.length > 60 ? 1 : 0), newDataPoint];
        
        const updatedRankings = currentCompetitors.map(comp => {
            const currentVal = newDataPoint[comp.name] as number;
            const profitVal = currentVal - 100;
            return {
                ...comp,
                rawProfit: profitVal,
                profit: `${profitVal > 0 ? '+' : ''}${profitVal.toFixed(1)}%`
            };
        });

        updatedRankings.sort((a, b) => b.rawProfit - a.rawProfit);

        const finalRankings = updatedRankings.map((item, index) => ({
            ...item,
            rank: index + 1
        }));
        
        setRankingList(finalRankings);
        
        return newHistory;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []); 

  const handleSavePrompt = (prompt: string) => {
    if (editingCapability) {
        setCustomPrompts(prev => ({
            ...prev,
            [editingCapability]: prompt
        }));
        setEditingCapability(null);
        addNotification("配置已保存", `[${AGENT_CAPABILITY_DETAILS[editingCapability].label}] 个性化指令已更新。`, 'success');
    }
  };

  const handleLogin = (username: string, email?: string, faction?: string) => {
    const newUser: User = {
        id: 'u-' + Math.floor(Math.random() * 10000),
        username: username,
        email: email,
        faction: (faction as any) || 'NETRUNNER',
        level: 1,
        achievements: [],
        avatarFrame: 'default'
    };
    setCurrentUser(newUser);
    saveUserSession(newUser); 
    setIsLoginModalOpen(false);
    addNotification("身份验证成功", `欢迎回来，${username}。系统连接稳定。`, 'success');

    if (pendingAction === 'createAgent') {
        setTimeout(() => {
            setIsCreateModalOpen(true);
        }, 300);
        setPendingAction(null);
    }
  };

  const handleLoginClose = () => {
      setIsLoginModalOpen(false);
      setPendingAction(null);
  };

  const handleLogout = () => {
      setCurrentUser(null);
      clearUserSession(); 
      
      setAgentName(null);
      setIsUserMenuOpen(false);
      setPendingAction(null);
      setActiveSideTab('MY_AGENT');
      setIsJoinedCompetition(false);
      
      competitorsRef.current = INITIAL_BOTS;
      setRankingList(INITIAL_BOTS);
      
      addNotification("断开连接", "用户已安全登出。Matrix 链接终止。", 'info');
  };

  const handleCreateAgent = (name: string, prompt: string, archetype: string, stats: AgentStats, modules: AgentModule[]) => {
    setAgentName(name);
    setAgentClass(archetype);
    setAgentStats(stats);
    setAgentModules(modules);
    setCustomPrompts(prev => ({
        ...prev,
        [AgentCapability.AUTO_TRADING]: prompt
    }));
    setIsCreateModalOpen(false);
    
    setIsJoinedCompetition(false);
    setIsJoinCompetitionModalOpen(true);

    addNotification("Agent 部署成功", `${name} 已就绪。请接入赛季以开始排位。`, 'success');
  };

  const handleEditAgentSave = (name: string, archetype: string, stats: AgentStats, modules: AgentModule[], prompt: string) => {
      setAgentName(name);
      setAgentClass(archetype);
      setAgentStats(stats);
      setAgentModules(modules);
      setCustomPrompts(prev => ({
          ...prev,
          [AgentCapability.AUTO_TRADING]: prompt
      }));
      addNotification("系统重构", "Agent 核心配置已更新。", 'success');
  };

  const handleDeleteAgent = () => {
      setConfirmModal({
          isOpen: true,
          title: '系统重构确认',
          message: '确定要销毁当前的 Agent 实例吗？\n\n执行此操作将永久删除：\n- 所有训练数据与收益记录\n- 当前配置的模组与人格指令\n- 赛季排名与积分',
          action: () => {
              clearAgentData(); 
              setAgentName(null);
              setAgentStats({ intelligence: 50, speed: 50, risk: 50 });
              setAgentModules([]);
              setCustomPrompts({});
              setIsJoinedCompetition(false);
              
              competitorsRef.current = competitorsRef.current.filter(c => !c.isUser);
              setRankingList(prev => prev.filter(c => !c.isUser));
              
              setConfirmModal(prev => ({ ...prev, isOpen: false }));
              addNotification("重构完成", "Agent 实例已销毁。系统资源已释放。", 'warning');
          }
      });
  };

  const handleSelectAgent = (name: string) => {
      if (highlightedAgent === name) {
          setHighlightedAgent(null);
      } else {
          setHighlightedAgent(name);
      }
  };

  const handleInspectAgent = (name: string) => {
      setInspectingAgent(name);
  };

  const handleChartClick = (seriesName: string) => {
      if (seriesName === agentName) return;
      handleInspectAgent(seriesName);
  };

  const handleJoinAction = () => {
      if (!currentUser) {
          setPendingAction('createAgent');
          setIsLoginModalOpen(true);
      } else {
          setIsCreateModalOpen(true);
      }
  };

  const handleConfirmJoinCompetition = () => {
      if (!agentName) return;

      setIsJoinedCompetition(true);
      setIsJoinCompetitionModalOpen(false);

      const userAgent: RankingItem = {
          id: 'user_agent',
          rank: 999, 
          name: agentName,
          class: agentClass === '趋势达人' || agentClass === '抄底专家' || agentClass === 'AI 预测' ? 'Quant' : 'NetRunner',
          profit: "+0.0%",
          rawProfit: 0,
          status: '在线',
          isUser: true,
          badges: ['legend']
      };

      if (!competitorsRef.current.some(c => c.isUser)) {
          competitorsRef.current = [...competitorsRef.current, userAgent];
          setChartData(prev => {
            const last = prev[prev.length - 1];
            if (last) {
                const newLast = {...last};
                newLast[agentName] = 100;
                return [...prev.slice(0, -1), newLast];
            }
            return prev;
          });
      }
      addNotification("参赛成功", "您的 Agent 已加入 S4 赛季排名池。", 'success');
  };

  const handleToggleJoin = () => {
      const isJoining = !isJoinedCompetition;
      
      if (isJoining) {
          setIsJoinCompetitionModalOpen(true);
          return;
      }

      const title = "退出排位确认";
      const message = "确定要暂时退出赛季排位吗？\n\n退出后将停止获取赛季积分，您的排名将冻结，且可能失去当前的连胜奖励。";
      
      setConfirmModal({
          isOpen: true,
          title,
          message,
          action: () => {
              setIsJoinedCompetition(false);
              setConfirmModal(prev => ({ ...prev, isOpen: false }));
              
              competitorsRef.current = competitorsRef.current.filter(c => !c.isUser);
              setRankingList(prev => prev.filter(c => !c.isUser));
              addNotification("休整模式", "已退出排位竞争。收益记录已存档。", 'info');
          }
      });
  };

  const handleSeasonPassJoin = () => {
    setIsSeasonPassOpen(false);
    
    if (!currentUser) {
        setPendingAction('createAgent');
        setIsLoginModalOpen(true);
    } else {
        if (!agentName) {
            setIsCreateModalOpen(true);
        } else if (!isJoinedCompetition) {
            setIsJoinCompetitionModalOpen(true);
        }
    }
  };

  const userRankItem = rankingList.find(r => r.isUser);
  const userRank = userRankItem?.rank;
  const userProfit = userRankItem?.profit;

  return (
    <div className="relative w-full h-[100dvh] bg-cp-black text-cp-text font-mono overflow-hidden selection:bg-cp-yellow selection:text-black text-xs flex flex-col transition-colors duration-500">
      <MatrixRain theme={theme} />
      
      <NotificationSystem notifications={notifications} onDismiss={handleDismissNotification} />

      {/* Modals Overlay */}
      <ConfirmModal 
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.action}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />

      <CompetitionJoinModal 
        isOpen={isJoinCompetitionModalOpen}
        onClose={() => setIsJoinCompetitionModalOpen(false)}
        onJoin={handleConfirmJoinCompetition}
      />
      
      {isLoginModalOpen && <LoginScreen onLogin={handleLogin} onClose={handleLoginClose} />}
      {isCreateModalOpen && <CreateAgentModal onCreate={handleCreateAgent} onClose={() => setIsCreateModalOpen(false)} onNotify={addNotification} />}
      {isEditAgentOpen && agentName && (
          <EditAgentModal 
            initialName={agentName}
            initialClass={agentClass}
            initialStats={agentStats}
            initialPrompt={customPrompts[AgentCapability.AUTO_TRADING] || ""}
            onSave={handleEditAgentSave}
            onClose={() => setIsEditAgentOpen(false)}
          />
      )}
      {isSeasonPassOpen && (
        <SeasonPassModal 
            onClose={() => setIsSeasonPassOpen(false)} 
            level={(currentUser && isJoinedCompetition) ? 3 : 0} 
            onJoin={handleSeasonPassJoin}
        />
      )}
      {readingArticle && (
        <ArticleModal 
            article={readingArticle}
            onClose={() => setReadingArticle(null)}
        />
      )}
      {isNotifHistoryOpen && (
        <NotificationHistoryModal 
            notifications={notificationHistory}
            onClose={() => setIsNotifHistoryOpen(false)}
            onClear={() => setNotificationHistory([])}
        />
      )}

      {showLanding ? (
        <LandingPage 
            onEnter={() => setShowLanding(false)} 
            onLogin={() => setIsLoginModalOpen(true)}
            isLoggedIn={!!currentUser}
            username={currentUser?.username}
        />
      ) : (
        /* MAIN DASHBOARD LAYOUT */
        <div className="relative z-10 flex flex-col flex-1 h-full overflow-hidden animate-in fade-in duration-700 bg-cp-black">
        
        {/* Header - Clean No Borders */}
        <header className="flex justify-between items-center z-50 px-6 h-[60px] shrink-0 border-b border-cp-border bg-cp-black">
          <div 
            className="flex items-center gap-4 cursor-pointer group h-full" 
            onClick={() => setShowLanding(true)}
            title="Return to Landing"
          >
             <div className="text-cp-yellow group-hover:scale-110 transition-transform">
                <Hexagon size={24} strokeWidth={1.5} />
             </div>
             <div className="flex items-baseline gap-3">
                <h1 className="text-xl font-bold tracking-tight font-serif text-cp-text uppercase">
                    Analyst Alchemist
                </h1>
                <span className="text-xs text-cp-text-muted font-sans hidden sm:block tracking-[0.2em] uppercase opacity-70">Season 4</span>
             </div>
          </div>
          <div className="flex items-center gap-6 h-full">
             <div className="hidden lg:flex items-center gap-4 text-xs font-bold font-sans text-cp-text-muted tracking-widest h-full">
                <span className="flex items-center gap-2"><Activity size={14} className="text-cp-red animate-pulse" /> MARKET: VOLATILE</span>
             </div>

             {/* Action Bar - Clean, no vertical borders */}
             <div className="flex items-center h-full gap-4">
                 <button onClick={toggleTheme} className="w-10 h-10 hover:text-cp-yellow transition-colors flex items-center justify-center rounded-full hover:bg-cp-dark/30">
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                 </button>
                 <button onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')} className="w-10 h-10 hover:text-cp-yellow transition-colors flex items-center justify-center font-bold text-xs font-serif rounded-full hover:bg-cp-dark/30">
                    {language.toUpperCase()}
                 </button>
                 <button onClick={() => setIsNotifHistoryOpen(true)} className="w-10 h-10 hover:text-cp-yellow transition-colors flex items-center justify-center relative rounded-full hover:bg-cp-dark/30">
                    <Bell size={18} />
                    {notificationHistory.length > 0 && notifications.length > 0 && (
                        <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-cp-red rounded-full animate-pulse"></span>
                    )}
                 </button>
             </div>

             {currentUser ? (
                 <div className="relative h-full flex items-center pl-2">
                     <div 
                        className="flex items-center gap-4 cursor-pointer group h-full hover:opacity-80 transition-opacity" 
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                     >
                        <div className="text-right hidden sm:block leading-tight">
                            <div className="text-cp-text font-bold font-serif text-sm tracking-wide">{currentUser.username}</div>
                            <div className="text-cp-yellow text-[10px] font-sans tracking-widest">LV.{currentUser.level}</div>
                        </div>
                        <div className="w-8 h-8 bg-cp-dark border border-cp-border flex items-center justify-center text-cp-yellow rounded-sm">
                            <UserIcon size={16} />
                        </div>
                     </div>

                     {isUserMenuOpen && (
                        <div className="absolute top-full right-0 w-64 bg-cp-black border border-cp-border shadow-2xl z-50 p-2 modal-animate">
                            <div className="p-4 border-b border-cp-border mb-2 hover-card">
                                <div className="text-[10px] text-cp-text-muted uppercase font-bold mb-1 tracking-widest">{t('app.operator_id')}</div>
                                <div className="text-cp-text font-mono text-xs opacity-70">{currentUser.id}</div>
                            </div>
                            <button 
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 p-3 text-cp-red hover:bg-cp-dim text-xs font-bold font-sans uppercase tracking-widest transition-colors hover-card"
                            >
                                <LogOut size={14} /> {t('app.logout')}
                            </button>
                        </div>
                     )}
                 </div>
             ) : (
                 <button 
                    onClick={() => setIsLoginModalOpen(true)}
                    className="ml-4 px-6 py-2 border border-cp-yellow text-cp-yellow hover:bg-cp-yellow hover:text-black transition-colors font-bold font-sans text-xs uppercase flex items-center gap-2 tracking-widest"
                 >
                    <LogIn size={14} />
                    <span>{t('app.login')}</span>
                 </button>
             )}
          </div>
        </header>

        {/* Mobile Navigation Tabs - Flush */}
        <div className="md:hidden flex h-[50px] border-b border-cp-border bg-cp-black shrink-0">
            <button 
                onClick={() => setMobileView('MARKET')} 
                className={`flex-1 font-bold uppercase flex items-center justify-center gap-2 transition-colors text-xs tracking-widest tab-item ${mobileView === 'MARKET' ? 'active' : ''}`}
            >
               <Activity size={14} /> {t('nav.market')}
            </button>
            <button 
                onClick={() => { setMobileView('SIDEBAR'); setActiveSideTab('MY_AGENT'); }} 
                className={`flex-1 font-bold uppercase flex items-center justify-center gap-2 transition-colors text-xs tracking-widest tab-item ${(mobileView === 'SIDEBAR' && activeSideTab === 'MY_AGENT') ? 'active' : ''}`}
            >
               <Users size={14} /> {t('nav.team')}
            </button>
            <button 
                onClick={() => { setMobileView('SIDEBAR'); setActiveSideTab('RANKING'); }} 
                className={`flex-1 font-bold uppercase flex items-center justify-center gap-2 transition-colors text-xs tracking-widest tab-item ${(mobileView === 'SIDEBAR' && activeSideTab === 'RANKING') ? 'active' : ''}`}
            >
               <Trophy size={14} /> {t('nav.ranking')}
            </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0 bg-cp-black">
          
          {/* Left Column: Market Data (70%) */}
          <section className={`${mobileView === 'MARKET' ? 'flex flex-1' : 'hidden'} md:flex w-full md:w-[70%] flex-col min-h-0`}>
            {/* Chart Area */}
            <div className="flex-grow bg-cp-black relative flex flex-col min-h-0">
              <div className="absolute top-4 left-4 text-cp-yellow text-[10px] z-10 font-bold font-sans tracking-[0.2em] uppercase flex items-center gap-2">
                 <div className="w-2 h-2 bg-cp-yellow rounded-full animate-pulse"></div>
                 {t('ranking.live_battle')}
              </div>
              <div className="flex-1 w-full h-full overflow-hidden">
                 <EquityChart 
                    data={chartData} 
                    highlightedAgent={highlightedAgent} 
                    onChartClick={handleChartClick}
                    theme={theme}
                 />
              </div>
            </div>
            
            {/* Bottom Info Panel */}
            <div className="h-[250px] flex-none border-t border-cp-border">
                <SeasonInfoPanel 
                    agentName={agentName} 
                    isJoined={isJoinedCompetition}
                    onOpenPass={() => setIsSeasonPassOpen(true)}
                    onOpenReport={setReadingArticle}
                    onSelectCapability={setSelectedCapability}
                />
            </div>
          </section>

          {/* Right Column: Sidebar (30%) */}
          <aside className={`${mobileView === 'SIDEBAR' ? 'flex flex-1' : 'hidden'} md:flex w-full md:w-[30%] flex-col bg-cp-black border-l border-cp-border`}>
            
            {/* Tabs - Bottom Border Style */}
            <div className="hidden md:flex items-center shrink-0 h-[60px] px-6 bg-cp-black gap-8">
                <button 
                    onClick={() => setActiveSideTab('MY_AGENT')}
                    className={`h-full flex items-center justify-center gap-2 font-bold font-sans uppercase text-xs tracking-widest tab-item ${activeSideTab === 'MY_AGENT' ? 'active' : ''}`}
                >
                    <Users size={14} /> {t('nav.my_team')}
                </button>
                <button 
                    onClick={() => setActiveSideTab('RANKING')}
                    className={`h-full flex items-center justify-center gap-2 font-bold font-sans uppercase text-xs tracking-widest tab-item ${activeSideTab === 'RANKING' ? 'active' : ''}`}
                >
                    <Trophy size={14} /> {t('nav.leaderboard')}
                </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden relative bg-cp-black border-t border-cp-border">
                {activeSideTab === 'MY_AGENT' ? (
                    <div className="w-full h-full flex flex-col animate-in fade-in duration-300">
                        {agentName ? (
                            <AgentPartyFrame 
                                agentName={agentName} 
                                agentClass={agentClass}
                                agentStats={agentStats}
                                agentModules={agentModules}
                                isJoined={isJoinedCompetition}
                                rank={userRank}
                                profit={userProfit}
                                onToggleJoin={handleToggleJoin}
                                onSelectCapability={setSelectedCapability}
                                onEditCapability={setEditingCapability} 
                                onEditAgent={() => setIsEditAgentOpen(true)}
                                onOpenChat={() => setIsChatOpen(true)}
                                onDeleteAgent={handleDeleteAgent}
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col p-8 items-center justify-center">
                                <CompetitionInviteCard onJoin={handleJoinAction} isLoggedIn={!!currentUser} />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="w-full h-full flex flex-col animate-in fade-in duration-300">
                         <RankingList 
                            data={rankingList}
                            onSelectAgent={handleSelectAgent} 
                            onInspectAgent={handleInspectAgent} 
                        />
                    </div>
                )}
            </div>
          </aside>
        </div>
      </div>
      )}

      {/* Overlays */}
      <ChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {selectedCapability && (
        <CapabilityModal 
          capability={selectedCapability} 
          customPrompt={customPrompts[selectedCapability]}
          onClose={() => setSelectedCapability(null)}
          onNotify={addNotification}
        />
      )}

      {editingCapability && (
        <PromptEditModal
            capability={editingCapability}
            initialPrompt={customPrompts[editingCapability] || ""}
            onSave={handleSavePrompt}
            onClose={() => setEditingCapability(null)}
        />
      )}

      {inspectingAgent && (
          <ExternalAgentModal
            agentName={inspectingAgent}
            onClose={() => setInspectingAgent(null)}
          />
      )}
    </div>
  );
};

export default App;