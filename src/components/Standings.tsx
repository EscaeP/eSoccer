import React from 'react';
import { STANDINGS } from '../data/standings';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

export function Standings() {
  const maxGD = Math.max(...STANDINGS.map(s => Math.abs(s.goalDifference)));

  return (
    <div className="flex-1 w-full h-full overflow-y-auto bg-slate-950 p-8 custom-scrollbar">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-slate-100 flex items-center gap-3">
            <span className="w-2 h-8 bg-amber-500 rounded-full inline-block"></span>
            湖北足球联赛 积分榜
          </h2>
          <p className="text-slate-400 mt-2 ml-5">赛季实时排名，战况可视化数据分析</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
          <div className="overflow-x-auto custom-scrollbar">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-900/80 border-b border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-wider sticky top-0 z-10 backdrop-blur-md">
                <div className="col-span-1 text-center">排名</div>
                <div className="col-span-2">球队</div>
                <div className="col-span-1 text-center">场次</div>
                <div className="col-span-2 text-center">胜/平/负</div>
                <div className="col-span-1 text-center">进/失</div>
                <div className="col-span-3 text-center">净胜球势能</div>
                <div className="col-span-1 text-center">胜率</div>
                <div className="col-span-1 text-center text-amber-500 font-black">积分</div>
              </div>

              <div className="divide-y divide-slate-800/50">
                {STANDINGS.map((team, index) => {
              const isTop3 = index < 3;
              const isBottom3 = index >= STANDINGS.length - 3;
              
              const winRate = team.played > 0 ? (team.won / team.played) * 100 : 0;
              const winPct = team.played > 0 ? (team.won / team.played) * 100 : 0;
              const drawPct = team.played > 0 ? (team.drawn / team.played) * 100 : 0;
              const lossPct = team.played > 0 ? (team.lost / team.played) * 100 : 0;
              
              const gdPct = (Math.abs(team.goalDifference) / maxGD) * 100;
              const isGdPositive = team.goalDifference > 0;
              const isGdZero = team.goalDifference === 0;

              return (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={team.team} 
                  className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-800/30 transition-colors group"
                >
                  {/* Rank */}
                  <div className="col-span-1 flex justify-center">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center font-black text-sm",
                      index === 0 ? "bg-amber-500 text-amber-950 shadow-[0_0_15px_rgba(245,158,11,0.5)]" :
                      index === 1 ? "bg-slate-300 text-slate-800 shadow-[0_0_15px_rgba(203,213,225,0.4)]" :
                      index === 2 ? "bg-amber-700 text-amber-100 shadow-[0_0_15px_rgba(180,83,9,0.5)]" :
                      "bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200"
                    )}>
                      {team.rank}
                    </div>
                  </div>

                  {/* Team */}
                  <div className="col-span-2 flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg",
                      isTop3 ? "bg-gradient-to-br from-slate-700 to-slate-800 text-white border border-slate-600" : "bg-slate-800 text-slate-400"
                    )}>
                      {team.team.charAt(0)}
                    </div>
                    <span className={cn(
                      "font-bold text-base",
                      isTop3 ? "text-slate-100" : "text-slate-300"
                    )}>{team.team}</span>
                  </div>

                  {/* Played */}
                  <div className="col-span-1 text-center font-mono text-slate-400">
                    {team.played}
                  </div>

                  {/* Win/Draw/Loss Bar */}
                  <div className="col-span-2 flex items-center px-4">
                    <div className="text-xs font-mono w-16 text-slate-500 text-right pr-2">
                      {team.won}-{team.drawn}-{team.lost}
                    </div>
                    <div className="h-2 flex-1 flex rounded-full overflow-hidden bg-slate-800">
                      {winPct > 0 && <div className="bg-emerald-500 h-full" style={{ width: `${winPct}%` }} title={`胜 ${team.won}`} />}
                      {drawPct > 0 && <div className="bg-slate-500 h-full" style={{ width: `${drawPct}%` }} title={`平 ${team.drawn}`} />}
                      {lossPct > 0 && <div className="bg-rose-500 h-full" style={{ width: `${lossPct}%` }} title={`负 ${team.lost}`} />}
                    </div>
                  </div>

                  {/* Goals */}
                  <div className="col-span-1 text-center justify-center font-mono text-sm flex gap-1">
                    <span className="text-emerald-400">{team.goalsFor}</span>
                    <span className="text-slate-600">/</span>
                    <span className="text-rose-400">{team.goalsAgainst}</span>
                  </div>

                  {/* GD Visualization */}
                  <div className="col-span-3 flex items-center justify-center gap-2">
                    {/* Negative side */}
                    <div className="flex-1 flex justify-end">
                      {!isGdPositive && !isGdZero && (
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${gdPct}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="h-2 bg-gradient-to-l from-rose-500 to-rose-600 rounded-l-full" 
                        />
                      )}
                    </div>
                    
                    {/* GD Value */}
                    <div className={cn(
                      "font-mono font-bold w-8 text-center text-sm",
                      isGdPositive ? "text-emerald-400" : isGdZero ? "text-slate-500" : "text-rose-400"
                    )}>
                      {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                    </div>

                    {/* Positive side */}
                    <div className="flex-1 flex justify-start">
                      {isGdPositive && !isGdZero && (
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${gdPct}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="h-2 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-r-full" 
                        />
                      )}
                    </div>
                  </div>

                  {/* Win Rate */}
                  <div className="col-span-1 text-center font-mono text-slate-400">
                    {winRate.toFixed(0)}%
                  </div>

                  {/* Points */}
                  <div className="col-span-1 text-center">
                    <span className={cn(
                      "text-xl font-black tabular-nums",
                      isTop3 ? "text-amber-400" : "text-slate-200"
                    )}>
                      {team.points}
                    </span>
                  </div>
                </motion.div>
              );
            })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
