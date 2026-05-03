import React, { useMemo } from 'react';
import { Match } from '../types';
import { MATCHES } from '../data/matches';
import { cn, getRelativeDateColor } from '../lib/utils';
import { Filter } from 'lucide-react';

interface MatchListProps {
  selectedMatchId: string | null;
  onSelectMatch: (id: string) => void;
  matches: Match[];
  selectedMonth: string | null;
  selectedCity: string | null;
  selectedTeam: string | null;
  onSelectMonth: (v: string | null) => void;
  onSelectCity: (v: string | null) => void;
  onSelectTeam: (v: string | null) => void;
}

export function MatchList({ 
  selectedMatchId, 
  onSelectMatch, 
  matches,
  selectedMonth,
  selectedCity,
  selectedTeam,
  onSelectMonth,
  onSelectCity,
  onSelectTeam
}: MatchListProps) {
  // Group matches by date
  const groupedMatches: Record<string, Match[]> = matches.reduce((acc, match) => {
    if (!acc[match.date]) {
      acc[match.date] = [];
    }
    acc[match.date].push(match);
    return acc;
  }, {} as Record<string, Match[]>);

  const sortedDates = Object.keys(groupedMatches).sort();
  // Get all unique dates from MATCHES for color generation consistent with map
  const uniqueDates = useMemo(() => Array.from(new Set(matches.map(m => m.date))).sort(), [matches]);
  
  const allMonths = useMemo(() => Array.from(new Set(MATCHES.map(m => m.date.split('-')[1]))).sort(), []);
  const allCities = useMemo(() => Array.from(new Set(MATCHES.map(m => m.city))).sort(), []);
  const allTeams = useMemo(() => Array.from(new Set(MATCHES.flatMap(m => [m.homeTeam, m.awayTeam]))).sort(), []);

  return (
    <div className="h-full flex flex-col w-full bg-slate-900/30">
      <div className="p-4 border-b border-slate-800 flex flex-col gap-4 shrink-0">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg flex items-center gap-2 text-slate-100">
            <span className="w-1 h-6 bg-red-600 rounded-full"></span>
            赛事日程
          </h3>
          <span className="text-[10px] text-slate-500 font-mono uppercase">2026 Season</span>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-2 text-xs">
          <div className="flex-1 flex gap-2 w-full">
            <select 
              className="bg-slate-800 border border-slate-700 text-slate-200 rounded p-1.5 flex-1 min-w-0 placeholder-slate-500"
              value={selectedMonth || ''}
              onChange={(e) => onSelectMonth(e.target.value || null)}
            >
              <option value="">所有月份</option>
              {allMonths.map(m => <option key={m} value={m}>{parseInt(m)}月</option>)}
            </select>
            <select 
              className="bg-slate-800 border border-slate-700 text-slate-200 rounded p-1.5 flex-1 min-w-0"
              value={selectedCity || ''}
              onChange={(e) => onSelectCity(e.target.value || null)}
            >
              <option value="">所有城市</option>
              {allCities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select 
              className="bg-slate-800 border border-slate-700 text-slate-200 rounded p-1.5 flex-1 min-w-0"
              value={selectedTeam || ''}
              onChange={(e) => onSelectTeam(e.target.value || null)}
            >
              <option value="">所有球队</option>
              {allTeams.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          {(selectedMonth || selectedCity || selectedTeam) && (
            <button 
              onClick={() => { onSelectMonth(null); onSelectCity(null); onSelectTeam(null); }}
              className="w-full text-center text-[10px] text-red-400 hover:text-red-300 py-1"
            >
              清除所有筛选
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {sortedDates.length === 0 ? (
          <div className="text-center text-slate-500 mt-10">
            没有符合条件的比赛
          </div>
        ) : sortedDates.map((date) => (
          <div key={date} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="space-y-3">
              {groupedMatches[date].map((match) => {
                const isSelected = selectedMatchId === match.id;
                
                // Keep team initials for the visual
                const homeInitial = match.homeTeam.charAt(0);
                const awayInitial = match.awayTeam.charAt(0);
                const colorConfig = getRelativeDateColor(date, uniqueDates);

                return (
                  <button
                    key={match.id}
                    onClick={() => onSelectMatch(match.id)}
                    className={cn(
                      "w-full text-left p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden group block",
                      isSelected 
                        ? "" 
                        : "bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/80"
                    )}
                    style={isSelected ? colorConfig.activeContainerStyle : {}}
                  >
                    <div className={cn(
                      "flex justify-between text-[10px] font-bold mb-2 uppercase",
                      !isSelected && "text-slate-500"
                    )} style={isSelected ? colorConfig.textStyle : {}}>
                      <span>{date.substring(5)} &bull; {match.time}</span>
                      <span className={isSelected ? "text-white" : ""} style={!isSelected ? colorConfig.textStyle : {}}>{match.stadium}</span>
                    </div>
                    
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 flex flex-col items-center">
                        <div className={cn(
                          "w-10 h-10 rounded-lg mb-1 flex items-center justify-center font-black",
                          isSelected 
                            ? "text-white shadow-lg" 
                            : "bg-slate-700 text-slate-300"
                        )} style={isSelected ? colorConfig.bgStyle : {}}>
                          {homeInitial}
                        </div>
                        <span className={cn("text-sm font-bold", isSelected ? "text-slate-100" : "text-slate-300")}>{match.homeTeam}</span>
                      </div>
                      
                      <div className={cn(
                        "font-black text-xs",
                        isSelected ? "text-xl italic bg-transparent px-0 py-0" : "px-3 py-1 bg-slate-700 rounded text-slate-400"
                      )} style={isSelected ? colorConfig.textStyle : {}}>
                        VS
                      </div>
                      
                      <div className="flex-1 flex flex-col items-center">
                        <div className={cn(
                          "w-10 h-10 rounded-lg mb-1 flex items-center justify-center font-black",
                          "bg-slate-700 text-slate-300"
                        )}>
                          {awayInitial}
                        </div>
                        <span className={cn("text-sm font-bold", isSelected ? "text-slate-100" : "text-slate-300")}>{match.awayTeam}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
