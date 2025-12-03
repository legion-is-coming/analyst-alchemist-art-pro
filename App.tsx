import React, { useState, useEffect, useRef } from 'react';
import MatrixRain from './components/MatrixRain';
import EquityChart from './components/EquityChart';
import AgentPartyFrame from './components/AgentPartyFrame';
import RankingList from './components/RankingList';
import ChatWidget from './components/ChatWidget';
import CapabilityModal from './components/CapabilityModal';
import CreateAgentModal from './components/CreateAgentModal';
import PromptEditModal from './components/PromptEditModal';
import CompetitionInviteCard from './components/CompetitionInviteCard';
import ExternalAgentModal from './components/ExternalAgentModal';
import LoginScreen from './components/LoginScreen';
import SeasonInfoPanel from './components/SeasonInfoPanel';
import SeasonPassModal from './components/SeasonPassModal';
import ConfirmModal from './components/ConfirmModal';
import NotificationSystem from './components/NotificationSystem';
import LandingPage from './components/LandingPage';
import ArticleModal from './components/ArticleModal';
import NotificationHistoryModal from './components/NotificationHistoryModal';
import CompetitionJoinModal from './components/CompetitionJoinModal';
import {
  ChartDataPoint,
  AgentCapability,
  User,
  AgentStats,
  AgentModule,
  RankingItem,
  AppNotification,
  AGENT_CAPABILITY_DETAILS
} from './types';
import {
  Hexagon,
  Activity,
  User as UserIcon,
  LogOut,
  LogIn,
  Trophy,
  Sun,
  Moon,
  Users,
  Bell,
  Languages,
  Palette
} from 'lucide-react';
import {
  loadUserSession,
  saveUserSession,
  clearUserSession,
  loadAgentData,
  saveAgentData,
  clearAgentData,
  SavedAgentData
} from './services/storageService';
import { useLanguage } from './contexts/LanguageContext';

// Initial Bots Configuration
const INITIAL_BOTS: RankingItem[] = [
  {
    id: 101,
    rank: 1,
    name: 'Alpha_Seeker',
    class: 'Quant',
    profit: '+0.0%',
    rawProfit: 100,
    status: '在线',
    badges: ['legend', 'whale']
  },
  {
    id: 102,
    rank: 2,
    name: 'Golden_Ratio',
    class: 'Scalper',
    profit: '+0.0%',
    rawProfit: 100,
    status: '在线',
    badges: ['quant']
  },
  {
    id: 103,
    rank: 3,
    name: 'Value_Discovery',
    class: 'Quant',
    profit: '+0.0%',
    rawProfit: 100,
    status: '在线'
  },
  {
    id: 104,
    rank: 4,
    name: 'Momentum_Flow',
    class: 'Scalper',
    profit: '+0.0%',
    rawProfit: 100,
    status: '训练中',
    badges: ['risk']
  },
  {
    id: 105,
    rank: 5,
    name: 'Reform_Strategy',
    class: 'Corpo',
    profit: '+0.0%',
    rawProfit: 100,
    status: '离线'
  },
  {
    id: 106,
    rank: 6,
    name: 'Growth_Hunter',
    class: 'NetRunner',
    profit: '+0.0%',
    rawProfit: 100,
    status: '在线'
  },
  {
    id: 107,
    rank: 7,
    name: 'Arbitrage_Bot',
    class: 'Quant',
    profit: '+0.0%',
    rawProfit: 100,
    status: '在线'
  },
  {
    id: 108,
    rank: 8,
    name: 'Dividend_Yield',
    class: 'Whale',
    profit: '+0.0%',
    rawProfit: 100,
    status: '在线'
  },
  {
    id: 109,
    rank: 9,
    name: 'Limit_Up',
    class: 'Scalper',
    profit: '+0.0%',
    rawProfit: 100,
    status: '训练中'
  },
  {
    id: 110,
    rank: 10,
    name: 'Micro_Cap',
    class: 'NetRunner',
    profit: '+0.0%',
    rawProfit: 100,
    status: '在线'
  }
];

const App: React.FC = () => {
  const { t, language, setLanguage, dictionary } = useLanguage();

  // Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [showLanding, setShowLanding] = useState(true);

  // User State (Account)
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Agent State (Character)
  const [agentName, setAgentName] = useState<string | null>(null);
  const [agentClass, setAgentClass] = useState<string>('智能型');
  const [agentStats, setAgentStats] = useState<AgentStats>({
    intelligence: 50,
    speed: 50,
    risk: 50
  });
  const [agentModules, setAgentModules] = useState<AgentModule[]>([]);

  // Competition State
  const [isJoinedCompetition, setIsJoinedCompetition] = useState(false);

  // App UI State
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [rankingList, setRankingList] = useState<RankingItem[]>(INITIAL_BOTS);

  // Refs for Simulation
  const competitorsRef = useRef<RankingItem[]>(INITIAL_BOTS);
  const currentUserRef = useRef<User | null>(null);

  const [selectedCapability, setSelectedCapability] =
    useState<AgentCapability | null>(null);
  const [highlightedAgent, setHighlightedAgent] = useState<string | null>(null);
  const [inspectingAgent, setInspectingAgent] = useState<string | null>(null);
  const [customPrompts, setCustomPrompts] = useState<Record<string, string>>(
    {}
  );
  const [editingCapability, setEditingCapability] =
    useState<AgentCapability | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Notification State
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [notificationHistory, setNotificationHistory] = useState<
    AppNotification[]
  >([]);
  const [isNotifHistoryOpen, setIsNotifHistoryOpen] = useState(false);

  // Article View State
  const [readingArticle, setReadingArticle] = useState<any | null>(null);

  // Sidebar Tab State
  const [activeSideTab, setActiveSideTab] = useState<'MY_AGENT' | 'RANKING'>(
    'MY_AGENT'
  );

  // Mobile View State
  const [mobileView, setMobileView] = useState<'MARKET' | 'SIDEBAR'>('MARKET');

  // Modals & Flow State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSeasonPassOpen, setIsSeasonPassOpen] = useState(false);
  const [isJoinCompetitionModalOpen, setIsJoinCompetitionModalOpen] =
    useState(false);

  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    action: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    action: () => {}
  });

  const [pendingAction, setPendingAction] = useState<'createAgent' | null>(
    null
  );

  // --- Persistence Logic ---

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
          class:
            savedAgent.class === '趋势达人' ||
            savedAgent.class === '抄底专家' ||
            savedAgent.class === 'AI 预测'
              ? 'Quant'
              : 'NetRunner',
          profit: '+0.0%',
          rawProfit: 0,
          status: '在线',
          isUser: true,
          badges: ['legend']
        };

        if (!competitorsRef.current.some((c) => c.isUser)) {
          competitorsRef.current = [...competitorsRef.current, userAgent];
          setChartData((prev) => {
            const last = prev[prev.length - 1];
            if (last) {
              const newLast = { ...last };
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
  }, [
    agentName,
    agentClass,
    agentStats,
    agentModules,
    customPrompts,
    isJoinedCompetition
  ]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (newTheme === 'light') {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
  };

  const scrollToSection = (section: 'MARKET' | 'TEAM' | 'RANK') => {
    if (typeof document === 'undefined') return;
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const addNotification = (
    title: string,
    message: string,
    type: AppNotification['type'] = 'info'
  ) => {
    const newNote: AppNotification = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      message,
      type,
      timestamp: Date.now()
    };
    setNotifications((prev) => [newNote, ...prev].slice(0, 5));
    setNotificationHistory((prev) => [newNote, ...prev].slice(0, 50));
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== newNote.id));
    }, 5000);
  };

  const handleDismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  useEffect(() => {
    const data: ChartDataPoint[] = [];
    const startTime = new Date().setHours(9, 30, 0, 0);
    let currentValues: Record<string, number> = {};
    competitorsRef.current.forEach((comp) => {
      currentValues[comp.name] = 100;
    });

    for (let i = 0; i < 50; i++) {
      const time = new Date(startTime + i * 1000 * 60 * 5);
      const point: ChartDataPoint = {
        time: time.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      Object.keys(currentValues).forEach((key) => {
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
          {
            title: 'Market Update',
            msg: 'Semiconductor sector seeing net inflows.',
            type: 'market'
          },
          {
            title: 'System Alert',
            msg: "'Alpha_Seeker' strategy triggered a stop-loss.",
            type: 'warning'
          },
          {
            title: 'Macro News',
            msg: 'Central bank releases liquidity report.',
            type: 'info'
          },
          {
            title: 'Whale Alert',
            msg: 'Large block trade detected: 520M.',
            type: 'market'
          },
          {
            title: 'Season Update',
            msg: 'Rankings refreshed. Top 10 volatility increased.',
            type: 'info'
          }
        ];
        const evt = events[Math.floor(Math.random() * events.length)];
        addNotification(evt.title, evt.msg, evt.type as any);
      }

      setChartData((prev) => {
        const last = prev[prev.length - 1];
        if (!last) return prev;

        const nextTime = new Date();
        const newDataPoint: ChartDataPoint = {
          time: nextTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })
        };

        const currentCompetitors = competitorsRef.current;

        currentCompetitors.forEach((comp) => {
          const lastVal = (last[comp.name] as number) || 100;
          const volatility = comp.isUser ? 3.5 : 2.5;
          const change = (Math.random() - 0.45) * volatility;
          newDataPoint[comp.name] = parseFloat((lastVal + change).toFixed(2));
        });

        const newHistory = [
          ...prev.slice(prev.length > 60 ? 1 : 0),
          newDataPoint
        ];

        const updatedRankings = currentCompetitors.map((comp) => {
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
      setCustomPrompts((prev) => ({
        ...prev,
        [editingCapability]: prompt
      }));
      setEditingCapability(null);
      const details = AGENT_CAPABILITY_DETAILS[editingCapability];
      const capabilityLabel = t(details.labelKey);
      addNotification(
        t('notifications.prompt_saved.title'),
        t('notifications.prompt_saved.message').replace(
          '{capability}',
          capabilityLabel
        ),
        'success'
      );
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
    addNotification(
      t('notifications.auth.title'),
      t('notifications.auth.message').replace('{name}', username),
      'success'
    );

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

    addNotification(
      t('notifications.logout.title'),
      t('notifications.logout.message'),
      'info'
    );
  };

  const handleCreateAgent = (
    name: string,
    prompt: string,
    archetype: string,
    stats: AgentStats,
    modules: AgentModule[]
  ) => {
    setAgentName(name);
    setAgentClass(archetype);
    setAgentStats(stats);
    setAgentModules(modules);
    setCustomPrompts((prev) => ({
      ...prev,
      [AgentCapability.AUTO_TRADING]: prompt
    }));
    setIsCreateModalOpen(false);

    setIsJoinedCompetition(false);
    setIsJoinCompetitionModalOpen(true);

    addNotification(
      t('notifications.agent_deployed.title'),
      t('notifications.agent_deployed.message').replace('{name}', name),
      'success'
    );
  };

  const handleDeleteAgent = () => {
    setConfirmModal({
      isOpen: true,
      title: t('confirm_modal.delete_agent_title'),
      message: t('confirm_modal.delete_agent_message'),
      action: () => {
        clearAgentData();
        setAgentName(null);
        setAgentStats({ intelligence: 50, speed: 50, risk: 50 });
        setAgentModules([]);
        setCustomPrompts({});
        setIsJoinedCompetition(false);

        competitorsRef.current = competitorsRef.current.filter(
          (c) => !c.isUser
        );
        setRankingList((prev) => prev.filter((c) => !c.isUser));

        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        addNotification(
          t('notifications.agent_deleted.title'),
          t('notifications.agent_deleted.message'),
          'warning'
        );
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
      class:
        agentClass === '趋势达人' ||
        agentClass === '抄底专家' ||
        agentClass === 'AI 预测'
          ? 'Quant'
          : 'NetRunner',
      profit: '+0.0%',
      rawProfit: 0,
      status: '在线',
      isUser: true,
      badges: ['legend']
    };

    if (!competitorsRef.current.some((c) => c.isUser)) {
      competitorsRef.current = [...competitorsRef.current, userAgent];
      setChartData((prev) => {
        const last = prev[prev.length - 1];
        if (last) {
          const newLast = { ...last };
          newLast[agentName] = 100;
          return [...prev.slice(0, -1), newLast];
        }
        return prev;
      });
    }
    addNotification(
      t('notifications.joined.title'),
      t('notifications.joined.message'),
      'success'
    );
  };

  const handleToggleJoin = () => {
    const isJoining = !isJoinedCompetition;

    if (isJoining) {
      setIsJoinCompetitionModalOpen(true);
      return;
    }

    const title = t('confirm_modal.withdraw_title');
    const message = t('confirm_modal.withdraw_message');

    setConfirmModal({
      isOpen: true,
      title,
      message,
      action: () => {
        setIsJoinedCompetition(false);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));

        competitorsRef.current = competitorsRef.current.filter(
          (c) => !c.isUser
        );
        setRankingList((prev) => prev.filter((c) => !c.isUser));
        addNotification(
          t('notifications.withdrawn.title'),
          t('notifications.withdrawn.message'),
          'info'
        );
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

  const userRankItem = rankingList.find((r) => r.isUser);
  const userRank = userRankItem?.rank;
  const userProfit = userRankItem?.profit;

  return (
    <div className='relative w-full h-[100dvh] bg-cp-black text-cp-text font-sans overflow-hidden selection:bg-cp-yellow selection:text-black text-[13px] md:text-[14px] flex flex-col tracking-[0.01em] antialiased transition-colors duration-500'>
      <MatrixRain theme={theme} />

      <NotificationSystem
        notifications={notifications}
        onDismiss={handleDismissNotification}
      />

      {/* Modals Overlay */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.action}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />

      <CompetitionJoinModal
        isOpen={isJoinCompetitionModalOpen}
        onClose={() => setIsJoinCompetitionModalOpen(false)}
        onJoin={handleConfirmJoinCompetition}
      />

      {isLoginModalOpen && (
        <LoginScreen onLogin={handleLogin} onClose={handleLoginClose} />
      )}
      {isCreateModalOpen && (
        <CreateAgentModal
          onCreate={handleCreateAgent}
          onClose={() => setIsCreateModalOpen(false)}
          onNotify={addNotification}
        />
      )}
      {isSeasonPassOpen && (
        <SeasonPassModal
          onClose={() => setIsSeasonPassOpen(false)}
          level={currentUser && isJoinedCompetition ? 3 : 0}
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
        /* MAIN DASHBOARD LAYOUT - FLUSH / SHARP / TEXTURE */
        <div className='relative z-10 flex flex-col flex-1 h-full overflow-hidden animate-in fade-in duration-700 bg-cp-black'>
          {/* Header - Flush Border Bottom */}
          <header className='flex justify-between items-center z-50 px-6 h-[60px] shrink-0 border-b border-cp-border bg-cp-black/95 backdrop-blur-sm'>
            <div
              className='flex items-center gap-4 cursor-pointer group h-full'
              onClick={() => setShowLanding(true)}
              title={t('app.back_to_landing')}>
              <div className='text-cp-yellow group-hover:scale-110 transition-transform drop-shadow-[0_0_12px_rgba(209,180,106,0.35)]'>
                <Palette size={24} strokeWidth={1.5} />
              </div>
              <div className='flex items-baseline gap-3'>
                <h1 className='text-2xl font-semibold tracking-[0.35em] font-serif text-cp-text uppercase leading-tight'>
                  {t('app.title')}
                </h1>
                <span className='text-[11px] text-cp-text-muted font-sans hidden sm:block tracking-[0.4em] uppercase opacity-80'>
                  {t('app.season')}
                </span>
              </div>
            </div>
            <div className='flex items-center gap-0 h-full border-l border-cp-border'>
              <div className='hidden lg:flex items-center gap-4 px-6 text-[11px] font-semibold font-sans text-cp-text-muted tracking-[0.45em] border-cp-border h-full'>
                <span className='flex items-center gap-2'>
                  <Activity size={14} className='text-cp-red animate-pulse' />{' '}
                  {t('app.market_label')}: {t('app.market_state')}
                </span>
              </div>

              {/* Action Bar */}
              <div className='flex items-center h-full'>
                <button
                  onClick={toggleTheme}
                  className='w-12 h-full hover:bg-cp-dim text-cp-text-muted hover:text-cp-yellow transition-colors flex items-center justify-center  border-cp-border'>
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <button
                  onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
                  className='w-12 h-full hover:bg-cp-dim text-cp-text-muted hover:text-cp-yellow transition-colors flex items-center justify-center  border-cp-border font-semibold text-[11px] font-serif tracking-[0.35em]'>
                  {language.toUpperCase()}
                </button>
                <button
                  onClick={() => setIsNotifHistoryOpen(true)}
                  className='w-12 h-full hover:bg-cp-dim text-cp-text-muted hover:text-cp-yellow transition-colors flex items-center justify-center  border-cp-border relative'>
                  <Bell size={18} />
                  {notificationHistory.length > 0 &&
                    notifications.length > 0 && (
                      <span className='absolute top-4 right-3 w-1.5 h-1.5 bg-cp-red rounded-full animate-pulse'></span>
                    )}
                </button>
              </div>

              {currentUser ? (
                <div className='relative h-full flex items-center'>
                  <div
                    className='flex items-center gap-4 cursor-pointer group h-full px-6 hover:bg-cp-dim transition-colors'
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                    <div className='text-right hidden sm:block leading-tight'>
                      <div className='text-cp-text font-semibold font-serif text-base tracking-wide'>
                        {currentUser.username}
                      </div>
                      <div className='text-cp-yellow text-[11px] font-sans tracking-[0.45em]'>
                        LV.{currentUser.level}
                      </div>
                    </div>
                    <div className='w-8 h-8 bg-cp-dark border border-cp-border flex items-center justify-center text-cp-yellow group-hover:text-white transition-colors'>
                      <UserIcon size={16} />
                    </div>
                  </div>

                  {isUserMenuOpen && (
                    <div className='absolute top-full right-0 w-64 bg-cp-black border border-cp-border shadow-2xl z-50 animate-in fade-in slide-in-from-top-2'>
                      <div className='p-4 border-b border-cp-border'>
                        <div className='text-[11px] text-cp-text-muted uppercase font-semibold mb-1 tracking-[0.45em]'>
                          {t('app.operator_id')}
                        </div>
                        <div className='text-cp-text font-mono text-[11px] opacity-80 tracking-widest'>
                          {currentUser.id}
                        </div>
                      </div>
                      <button
                        onClick={handleLogout}
                        className='w-full flex items-center gap-2 p-4 text-cp-red hover:bg-cp-dim text-[11px] font-semibold font-sans uppercase tracking-[0.4em] transition-colors'>
                        <LogOut size={14} /> {t('app.logout')}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className='px-8 h-full bg-cp-yellow text-black hover:bg-white transition-colors font-semibold font-sans text-[11px] uppercase flex items-center gap-2 tracking-[0.45em]'>
                  <LogIn size={14} />
                  <span>{t('app.login')}</span>
                </button>
              )}
            </div>
          </header>

          {/* Mobile Navigation Tabs - Flush */}
          <div className='md:hidden flex h-[50px] border-b border-cp-border bg-cp-black/95 shrink-0 backdrop-blur'>
            <button
              onClick={() => setMobileView('MARKET')}
              className={`flex-1 font-semibold uppercase flex items-center justify-center gap-2 transition-colors border-r border-cp-border text-[11px] tracking-[0.4em] ${
                mobileView === 'MARKET'
                  ? 'bg-cp-yellow text-black'
                  : 'text-cp-text-muted'
              }`}>
              <Activity size={14} /> {t('nav.market')}
            </button>
            <button
              onClick={() => {
                setMobileView('TEAM');
                scrollToSection('TEAM');
              }}
              className={`flex-1 font-semibold uppercase flex items-center justify-center gap-2 transition-colors border-r border-cp-border text-[11px] tracking-[0.4em] ${
                mobileView === 'TEAM'
                  ? 'bg-cp-yellow text-black'
                  : 'text-cp-text-muted'
              }`}>
              <Users size={14} /> {t('nav.team')}
            </button>
            <button
              onClick={() => {
                setMobileView('RANK');
                scrollToSection('RANK');
              }}
              className={`flex-1 font-semibold uppercase flex items-center justify-center gap-2 transition-colors border-cp-border text-[11px] tracking-[0.4em] ${
                mobileView === 'RANK'
                  ? 'bg-cp-yellow text-black'
                  : 'text-cp-text-muted'
              }`}>
              <Trophy size={14} /> {t('nav.ranking')}
            </button>
          </div>

          {/* Main Content (Flush Grid) */}
          <div className='flex-1 flex flex-col md:flex-row overflow-hidden min-h-0 bg-cp-black'>
            {/* Left Column: Market Data (70% width) - Increased Chart Area */}
            <section
              className={`${
                mobileView !== 'MARKET' ? 'hidden md:flex' : ''
              } w-full md:w-[70%] flex flex-col min-h-0 border-r border-cp-border`}>
              {/* Chart Area */}
              <div className='flex-grow bg-cp-black relative flex flex-col min-h-0'>
                <div className='absolute top-0 left-0 bg-cp-yellow text-black text-[10px] px-4 py-1 z-10 font-bold font-sans tracking-[0.2em] uppercase'>
                  {t('ranking.live_battle')}
                </div>
                <div className='flex-1 w-full h-full overflow-hidden'>
                  <EquityChart
                    data={chartData}
                    highlightedAgent={highlightedAgent}
                    onChartClick={handleChartClick}
                    theme={theme}
                  />
                </div>
              </div>

              {/* Bottom Info Panel - Fixed Height */}
              <div className='h-[250px] flex-none border-t border-cp-border'>
                <SeasonInfoPanel
                  agentName={agentName}
                  isJoined={isJoinedCompetition}
                  onOpenPass={() => setIsSeasonPassOpen(true)}
                  onOpenReport={setReadingArticle}
                />
              </div>
            </section>

            {/* Right Column: Agent/Ranking (30% width) */}
            <aside
              className={`${
                mobileView === 'SIDEBAR' ? 'flex flex-1' : 'hidden'
              } md:flex w-full md:w-[30%] flex-col bg-cp-black`}>
              {/* Tabs - Flush */}
              <div className='hidden md:flex items-center shrink-0 h-[50px] border-b border-cp-border bg-cp-dark'>
                <button
                  onClick={() => setActiveSideTab('MY_AGENT')}
                  className={`flex-1 h-full flex items-center justify-center gap-2 font-bold font-sans uppercase text-xs tracking-widest transition-colors border-r border-cp-border hover:bg-cp-dim ${
                    activeSideTab === 'MY_AGENT'
                      ? 'text-cp-yellow bg-cp-black'
                      : 'text-cp-text-muted'
                  }`}>
                  <Users size={14} /> {t('nav.my_team')}
                </button>
                <button
                  onClick={() => setActiveSideTab('RANKING')}
                  className={`flex-1 h-full flex items-center justify-center gap-2 font-bold font-sans uppercase text-xs tracking-widest transition-colors hover:bg-cp-dim ${
                    activeSideTab === 'RANKING'
                      ? 'text-cp-cyan bg-cp-black'
                      : 'text-cp-text-muted'
                  }`}>
                  <Trophy size={14} /> {t('nav.leaderboard')}
                </button>
              </div>

              {/* Tab Content */}
              <div className='flex-1 overflow-hidden relative bg-cp-black'>
                {activeSideTab === 'MY_AGENT' ? (
                  <div className='w-full h-full flex flex-col animate-in fade-in duration-300'>
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
                        onOpenChat={() => setIsChatOpen(true)}
                        onDeleteAgent={handleDeleteAgent}
                      />
                    ) : (
                      <div className='w-full h-full flex flex-col p-8 items-center justify-center'>
                        <CompetitionInviteCard
                          onJoin={handleJoinAction}
                          isLoggedIn={!!currentUser}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className='w-full h-full flex flex-col animate-in fade-in duration-300'>
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
          initialPrompt={customPrompts[editingCapability] || ''}
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
