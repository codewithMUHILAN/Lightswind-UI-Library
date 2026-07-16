"use client";

import React from "react";
import { LineChart, Book, Target, Award, Brain, TrendingUp, ChevronRight, Activity } from "lucide-react";
import { motion } from "framer-motion";

const StudentProgress01 = () => {
  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-12 bg-white dark:bg-zinc-950 rounded-[40px] border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 text-indigo-500 text-xs font-black uppercase tracking-[0.2em] mb-2">
            <Brain className="w-4 h-4" /> Cognitive Analytics
          </div>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Growth Analytics</h2>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
           <span className="w-2 h-2 rounded-full bg-emerald-500" />
           <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Global Percentile: Top 2%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 space-y-8">
           {/* Progress Graph Simulation */}
           <div className="p-8 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-[32px] border border-zinc-100 dark:border-zinc-800 relative h-64 overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-500" /> Skill Acquisition Rate
                 </h3>
                 <div className="flex gap-2">
                    {['Q1', 'Q2', 'Q3', 'Q4'].map(q => (
                       <span key={q} className={`px-2 py-1 rounded text-[10px] font-bold ${q === 'Q4' ? 'bg-indigo-500 text-white' : 'text-zinc-400'}`}>{q}</span>
                    ))}
                 </div>
              </div>

              <div className="flex items-end justify-between h-32 gap-2">
                 {[45, 65, 55, 85, 75, 95, 88].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      className="flex-1 bg-indigo-500/20 dark:bg-indigo-500/10 rounded-t-lg relative group"
                    >
                       <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-500 rounded-full scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                    </motion.div>
                 ))}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-50/80 dark:from-zinc-900/80 to-transparent pointer-events-none h-12 bottom-0" />
           </div>

           <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                 <Target className="w-6 h-6 text-indigo-500 mb-4" />
                 <div className="text-2xl font-black text-zinc-900 dark:text-white">84%</div>
                 <div className="text-[10px] font-bold text-zinc-500 uppercase mt-1">Average Accuracy</div>
              </div>
              <div className="p-6 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                 <Award className="w-6 h-6 text-amber-500 mb-4" />
                 <div className="text-2xl font-black text-zinc-900 dark:text-white">12</div>
                 <div className="text-[10px] font-bold text-zinc-500 uppercase mt-1">Earned Badges</div>
              </div>
           </div>
        </div>

        <div className="space-y-6">
           <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">Competency Radar</h3>
           <div className="space-y-4">
              {[
                { name: "Algorithm Design", val: 92 },
                { name: "System Thinking", val: 78 },
                { name: "Technical Writing", val: 65 },
                { name: "Collaboration", val: 88 },
              ].map(skill => (
                <div key={skill.name} className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:border-indigo-500/30 transition-all cursor-pointer">
                   <div className="flex justify-between text-xs font-bold text-zinc-900 dark:text-white mb-3">
                      <span>{skill.name}</span>
                      <span>{skill.val}%</span>
                   </div>
                   <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.val}%` }}
                        className="h-full bg-indigo-500"
                      />
                   </div>
                </div>
              ))}
           </div>
           
           <button className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg">
             Detailed Report <ChevronRight className="w-4 h-4" />
           </button>
        </div>
      </div>
    </div>
  );
};

export default StudentProgress01;
