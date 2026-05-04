import React, { useState, useMemo } from 'react';
import { LeagueMap } from './components/LeagueMap';
import { MatchList } from './components/MatchList';
import { Standings } from './components/Standings';
import { DataAnalysis } from './components/DataAnalysis';
import { TeamList } from './components/TeamList';
import { MATCHES } from './data/matches';
import { motion, AnimatePresence } from 'motion/react';
import { Map as MapIcon, ListOrdered, BarChart3, Users, ChevronUp, ChevronDown } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'schedule' | 'standings' | 'analysis' | 'teams'>('schedule');
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [showMobileList, setShowMobileList] = useState(false);

  const handleSetMonth = (val: string | null) => {
    setSelectedMonth(val);
    setSelectedMatchId(null);
  };
  
  const handleSetCity = (val: string | null) => {
    setSelectedCity(val);
    setSelectedMatchId(null);
  };
  
  const handleSetTeam = (val: string | null) => {
    setSelectedTeam(val);
    setSelectedMatchId(null);
  };

  const filteredMatches = useMemo(() => {
    return MATCHES.filter(match => {
      const matchMonth = match.date.split('-')[1];
      if (selectedMonth && matchMonth !== selectedMonth) return false;
      if (selectedCity && match.city !== selectedCity) return false;
      if (selectedTeam && match.homeTeam !== selectedTeam && match.awayTeam !== selectedTeam) return false;
      return true;
    });
  }, [selectedMonth, selectedCity, selectedTeam]);

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Header Navigation */}
      <header className="h-16 md:h-20 border-b border-slate-800 flex items-center justify-between px-4 md:px-10 bg-slate-900/50 shrink-0 z-10">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-red-600 rounded-md md:rounded-lg flex items-center justify-center font-bold text-lg md:text-xl italic">楚</div>
          <div>
            <h1 className="text-lg md:text-2xl font-black tracking-tighter uppercase whitespace-nowrap">2026 楚超联赛 <span className="text-red-500 hidden sm:inline">湖北超级联赛</span></h1>
            <p className="text-[10px] md:text-xs text-slate-400 uppercase tracking-widest font-semibold hidden xs:block">城市足球联赛可视化</p>
          </div>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium uppercase tracking-wider">
          <button 
            onClick={() => setView('schedule')} 
            className={`transition-colors pb-1 ${view === 'schedule' ? 'text-red-500 border-b-2 border-red-500' : 'text-slate-400 hover:text-white'}`}
          >
            赛事地图
          </button>
          <button 
            onClick={() => setView('standings')} 
            className={`transition-colors pb-1 ${view === 'standings' ? 'text-red-500 border-b-2 border-red-500' : 'text-slate-400 hover:text-white'}`}
          >
            积分榜
          </button>
          <button 
            onClick={() => setView('analysis')} 
            className={`transition-colors pb-1 ${view === 'analysis' ? 'text-red-500 border-b-2 border-red-500' : 'text-slate-400 hover:text-white'}`}
          >
            数据分析
          </button>
          <button 
            onClick={() => setView('teams')} 
            className={`transition-colors pb-1 ${view === 'teams' ? 'text-red-500 border-b-2 border-red-500' : 'text-slate-400 hover:text-white'}`}
          >
            球队一览
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative">
        <AnimatePresence mode="wait">
          {view === 'schedule' ? (
            <motion.div 
              key="schedule"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col md:flex-row w-full h-full absolute inset-0"
            >
              {/* Map Area */}
              <section className="flex-1 relative bg-slate-950 p-0 md:p-8 flex items-center justify-center z-0">
                <LeagueMap 
                  selectedMatchId={selectedMatchId} 
                  onSelectMatch={setSelectedMatchId} 
                  matches={filteredMatches}
                />
              </section>

              {/* Sidebar / Mobile Bottom Sheet */}
              <aside 
                className={`absolute md:relative bottom-16 md:bottom-0 left-0 w-full md:w-2/5 border-t md:border-t-0 md:border-l border-slate-700 md:border-slate-800 flex flex-col bg-slate-900 md:bg-slate-900/30 flex-shrink-0 z-20 transition-all duration-300 md:translate-y-0 rounded-t-3xl md:rounded-none shadow-[0_-10px_40px_rgba(0,0,0,0.5)] md:shadow-none
                ${showMobileList ? 'h-[75vh]' : 'h-14 md:h-full'} overflow-hidden md:overflow-visible`}
              >
                {/* Mobile Toggle Button */}
                <button 
                  className="w-full h-14 shrink-0 md:hidden flex items-center justify-center border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                  onClick={() => setShowMobileList(!showMobileList)}
                >
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-1 bg-slate-600 rounded-full" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {showMobileList ? '收起赛事列表' : '展开赛事列表'}
                    </span>
                  </div>
                </button>

                <div className="flex-1 overflow-hidden flex flex-col">
                  <MatchList 
                    selectedMatchId={selectedMatchId} 
                    onSelectMatch={setSelectedMatchId} 
                    matches={filteredMatches}
                    selectedMonth={selectedMonth}
                    selectedCity={selectedCity}
                    selectedTeam={selectedTeam}
                    onSelectMonth={handleSetMonth}
                    onSelectCity={handleSetCity}
                    onSelectTeam={handleSetTeam}
                  />
                </div>
              </aside>
            </motion.div>
          ) : view === 'standings' ? (
            <motion.div 
              key="standings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="flex-1 w-full h-full absolute inset-0"
            >
              <Standings />
            </motion.div>
          ) : view === 'analysis' ? (
            <motion.div 
              key="analysis"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="flex-1 w-full h-full absolute inset-0"
            >
              <DataAnalysis />
            </motion.div>
          ) : (
            <motion.div 
              key="teams"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="flex-1 w-full h-full absolute inset-0"
            >
              <TeamList />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Sub-footer stats bar (Desktop) */}
      <footer className="h-12 bg-slate-900 border-t border-slate-800 hidden md:flex items-center px-10 gap-12 shrink-0 relative z-20">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase">参赛球队</span>
          <span className="text-sm font-black">17支</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase">总场次</span>
          <span className="text-sm font-black">240+</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase">覆盖地级市</span>
          <span className="text-sm font-black">湖北全境</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-[10px] font-medium text-slate-400">系统状态：实时更新中</span>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <nav className="h-16 bg-slate-900 border-t border-slate-800 flex md:hidden items-center justify-around shrink-0 relative z-30 pb-safe">
        <button 
          onClick={() => { setView('schedule'); setShowMobileList(false); }}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${view === 'schedule' ? 'text-red-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <MapIcon className="w-5 h-5" />
          <span className="text-[10px] font-bold">地图</span>
        </button>
        <button 
          onClick={() => setView('standings')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${view === 'standings' ? 'text-red-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <ListOrdered className="w-5 h-5" />
          <span className="text-[10px] font-bold">积分榜</span>
        </button>
        <button 
          onClick={() => setView('analysis')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${view === 'analysis' ? 'text-red-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[10px] font-bold">数据</span>
        </button>
        <button 
          onClick={() => setView('teams')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${view === 'teams' ? 'text-red-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-bold">球队</span>
        </button>
      </nav>
    </div>
  );
}
