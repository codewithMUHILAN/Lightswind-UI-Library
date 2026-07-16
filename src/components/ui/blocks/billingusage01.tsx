"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, Server, Users, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/lightswind/button";
import { Badge } from "@/components/lightswind/badge";

export default function BillingUsage01() {
  const usageStats = [
    { label: "API Requests", current: 850000, limit: 1000000, suffix: "", icon: Zap, color: "bg-blue-500" },
    { label: "Storage Used", current: 42, limit: 50, suffix: "GB", icon: Server, color: "bg-emerald-500" },
    { label: "Team Members", current: 4, limit: 5, suffix: "", icon: Users, color: "bg-purple-500" },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 ">
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 dark:from-zinc-100 dark:to-zinc-300 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 dark:bg-black/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="relative z-10 text-center md:text-left">
          <Badge variant="outline" className="mb-3 border-white/20 text-white/80 dark:border-black/20 dark:text-black/80">Pro Plan</Badge>
          <h2 className="text-2xl font-bold text-white dark:text-zinc-900 mb-2">You're approaching your plan limits</h2>
          <p className="text-zinc-400 dark:text-zinc-600 max-w-md">
            Upgrade to the Enterprise plan for unlimited API requests, dedicated support, and advanced security features.
          </p>
        </div>

        <Button className="relative z-10 bg-white text-zinc-900 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800 rounded-xl h-12 px-6 font-bold whitespace-nowrap">
          Upgrade to Enterprise
          <ArrowUpRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {usageStats.map((stat, idx) => {
          const percent = (stat.current / stat.limit) * 100;
          const isWarning = percent > 80;

          return (
            <div key={idx} className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{stat.label}</h3>
              </div>

              <div className="mb-2 flex justify-between items-end">
                <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
                  {stat.current.toLocaleString()} <span className="text-sm font-medium text-zinc-500">{stat.suffix}</span>
                </div>
                <div className="text-sm text-zinc-500 font-medium">
                  / {stat.limit.toLocaleString()} {stat.suffix}
                </div>
              </div>

              <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full ${isWarning ? 'bg-red-500' : stat.color}`}
                />
              </div>
              {isWarning && (
                <p className="mt-3 text-xs font-semibold text-red-500">
                  Over 80% used. Consider upgrading.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
