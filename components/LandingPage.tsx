
import React from 'react';
import { Hexagon, Activity, Crosshair, Search, Rewind, PenTool, ChevronRight, Zap, Shield, Trophy, Users, Target, Gift, Palette } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface LandingPageProps {
  onEnter: () => void;
  onLogin: () => void;
  isLoggedIn: boolean;
  username?: string;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter, onLogin, isLoggedIn, username }) => {
  const { t } = useLanguage();

  return (
    <div className="relative w-full min-h-screen bg-cp-black text-white overflow-y-auto custom-scrollbar flex flex-col">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cp-dim via-cp-black to-cp-black opacity-80 pointer-events-none"></div>
      
      {/* Grid Overlay */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ 
             backgroundImage: `linear-gradient(var(--cp-border) 1px, transparent 1px), linear-gradient(90deg, var(--cp-border) 1px, transparent 1px)`, 
             backgroundSize: '40px 40px' 
           }}>
      </div>

      {/* Header */}
      <header className="relative z-10 w-full px-8 py-6 flex justify-between items-center border-b border-cp-border bg-cp-black/50 backdrop-blur-sm sticky top-0">
         <div className="flex items-center gap-3">
             <div className="text-cp-yellow animate-pulse">
                 <Hexagon size={28} strokeWidth={1.5} />
             </div>
             <div>
                 <h1 className="text-xl font-bold font-serif tracking-widest text-white uppercase">Analyst Alchemist</h1>
                 <div className="flex items-center gap-2 text-[10px] text-cp-text-muted font-mono">
                     <span className="w-2 h-2 rounded-full bg-green-500"></span>
                     {t('landing.system_online')}
                 </div>
             </div>
         </div>

         <div className="hidden md:flex items-center gap-8">
             <div className="flex flex-col items-end text-right">
                 <span className="text-[10px] text-cp-text-muted uppercase tracking-[0.2em]">{t('landing.version')}</span>
                 <span className="text-xs font-bold text-cp-yellow animate-pulse">{t('landing.season_live')}</span>
             </div>
         </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center pt-24 pb-20 px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-1 rounded-full border border-cp-yellow/30 bg-cp-yellow/5 text-cp-yellow text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Trophy size={14} /> {t('landing.season_live')}
          </div>
          
          <h2 className="text-5xl md:text-8xl font-serif font-bold tracking-tighter text-white mb-2 leading-tight animate-in fade-in slide-in-from-bottom-8 duration-1000">
              {t('landing.hero_title_1')} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cp-yellow via-white to-cp-yellow animate-pulse-fast">
                {t('landing.hero_title_2')}
              </span>
          </h2>
          
          <p className="max-w-2xl text-cp-text-muted text-lg font-light leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
              {t('landing.hero_desc')}
          </p>

          <div className="flex flex-col md:flex-row gap-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
              {!isLoggedIn ? (
                  <>
                    <button 
                        onClick={onEnter}
                        className="px-10 py-4 btn-outline text-sm font-bold tracking-widest flex items-center gap-2"
                    >
                        <Activity size={18} /> {t('landing.init_system')}
                    </button>
                    <button 
                        onClick={onLogin}
                        className="px-12 py-4 btn-gold text-sm font-bold tracking-widest flex items-center gap-2 shadow-[0_0_30px_rgba(197,160,89,0.3)] hover:shadow-[0_0_50px_rgba(197,160,89,0.5)] transition-shadow"
                    >
                        {t('landing.link_identity')} <ChevronRight size={18} />
                    </button>
                  </>
              ) : (
                  <button 
                    onClick={onEnter}
                    className="px-16 py-5 btn-gold text-base font-bold tracking-widest flex items-center gap-3 shadow-[0_0_30px_rgba(197,160,89,0.3)] hover:shadow-[0_0_50px_rgba(197,160,89,0.5)] transition-shadow"
                  >
                     <Zap size={20} fill="black" /> {t('landing.continue_as')} {username}
                  </button>
              )}
          </div>
      </section>

      {/* Feature Grid */}
      <section className="relative z-10 py-20 px-6 bg-cp-dark border-y border-cp-border">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                  { 
                      icon: Crosshair, 
                      title: t('landing.features.strategy_title'),
                      desc: t('landing.features.strategy_desc')
                  },
                  { 
                      icon: Rewind, 
                      title: t('landing.features.backtest_title'),
                      desc: t('landing.features.backtest_desc')
                  },
                  { 
                      icon: Users, 
                      title: t('landing.features.community_title'),
                      desc: t('landing.features.community_desc')
                  },
                  { 
                      icon: Shield, 
                      title: t('landing.features.security_title'),
                      desc: t('landing.features.security_desc')
                  }
              ].map((feature, idx) => (
                  <div key={idx} className="group p-8 border border-cp-border bg-cp-black hover:border-cp-yellow transition-colors hover-card">
                      <div className="w-12 h-12 mb-6 border border-cp-border group-hover:border-cp-yellow flex items-center justify-center bg-cp-dark text-cp-text-muted group-hover:text-cp-yellow transition-colors">
                          <feature.icon size={24} strokeWidth={1.5} />
                      </div>
                      <h3 className="text-lg font-serif font-bold text-white mb-3 group-hover:text-cp-yellow transition-colors">
                          {feature.title}
                      </h3>
                      <p className="text-sm text-cp-text-muted leading-relaxed font-sans opacity-80">
                          {feature.desc}
                      </p>
                  </div>
              ))}
          </div>
      </section>

      {/* Live Ranking Preview (Static Mock) */}
      <section className="relative z-10 py-24 px-6 overflow-hidden">
          <div className="max-w-5xl mx-auto">
              <div className="flex justify-between items-end mb-10">
                  <div>
                      <h3 className="text-3xl font-serif font-bold text-white mb-2">{t('landing.top_performers')}</h3>
                      <p className="text-cp-text-muted text-sm font-sans tracking-wide">SEASON 4 // LIVE FEED</p>
                  </div>
                  <button className="text-cp-yellow text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:text-white transition-colors">
                      {t('landing.enter')} <ChevronRight size={14} />
                  </button>
              </div>

              <div className="border border-cp-border bg-cp-black/80 backdrop-blur-md">
                  {[
                      { rank: 1, name: 'Alpha_Seeker', profit: '+142.5%', badge: 'LEGEND' },
                      { rank: 2, name: 'Deep_Value', profit: '+89.2%', badge: 'WHALE' },
                      { rank: 3, name: 'Quant_X', profit: '+76.4%', badge: 'BOT' },
                  ].map((item) => (
                      <div key={item.rank} className="flex items-center p-6 border-b border-cp-border last:border-0 hover:bg-cp-yellow/5 transition-colors group cursor-default">
                           <div className="w-16 font-serif font-bold text-2xl text-cp-text-muted group-hover:text-cp-yellow transition-colors">
                               0{item.rank}
                           </div>
                           <div className="flex-1">
                               <div className="flex items-center gap-3">
                                   <span className="font-bold text-lg text-white">{item.name}</span>
                                   <span className="px-2 py-0.5 text-[10px] font-bold border border-cp-border text-cp-text-muted uppercase rounded-full">
                                       {item.badge}
                                   </span>
                               </div>
                           </div>
                           <div className="text-right">
                               <div className="font-mono font-bold text-xl text-cp-yellow">{item.profit}</div>
                               <div className="text-[10px] text-cp-text-muted uppercase">Total Return</div>
                           </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-cp-border bg-cp-black py-12 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2 text-cp-text-muted">
                  <Hexagon size={16} />
                  <span className="text-xs font-mono">{t('landing.footer.rights')}</span>
              </div>
              <div className="flex gap-8">
                  <a href="#" className="text-xs font-bold text-cp-text-muted hover:text-cp-yellow transition-colors uppercase tracking-widest">{t('landing.footer.privacy')}</a>
                  <a href="#" className="text-xs font-bold text-cp-text-muted hover:text-cp-yellow transition-colors uppercase tracking-widest">{t('landing.footer.terms')}</a>
              </div>
          </div>
      </footer>
    </div>
  );
};

export default LandingPage;
