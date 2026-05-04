import React from 'react';
import { TEAMS } from '../data/teams';
import { motion } from 'motion/react';
import { Shield } from 'lucide-react';

export function TeamList() {
  return (
    <div className="flex-1 w-full h-full overflow-y-auto bg-slate-950 p-4 md:p-8 custom-scrollbar">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-slate-100 flex items-center gap-2 md:gap-3">
            <span className="w-2 h-6 md:h-8 bg-sky-500 rounded-full inline-block"></span>
            参赛队伍一览
          </h2>
          <p className="text-xs md:text-base text-slate-400 mt-2 ml-4 md:ml-5">
            2026湖北省城市足球联赛共有17支参赛队伍，代表全省17个市州。每支队伍都有自己独特的昵称和特色，展现了各自城市的文化底蕴。
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-20">
          {TEAMS.map((team, index) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:bg-slate-800/60 hover:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 text-white border border-slate-600 flex items-center justify-center font-black text-2xl shadow-inner group-hover:from-sky-900 group-hover:to-slate-800 group-hover:border-sky-700 transition-colors">
                  {team.name.charAt(0)}
                </div>
                <div className="bg-slate-950 text-slate-400 text-xs font-mono px-2 py-1 rounded-md border border-slate-800 group-hover:text-sky-400 group-hover:border-sky-900 transition-colors">
                  #{team.id}
                </div>
              </div>
              
              <div className="mb-1">
                <h3 className="text-xl font-bold text-slate-200 group-hover:text-white transition-colors">{team.name}队</h3>
              </div>
              
              <div className="flex items-center gap-2 text-sky-400/80 group-hover:text-sky-400 transition-colors">
                <Shield size={14} className="group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium tracking-wide">
                  {team.nickname}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
