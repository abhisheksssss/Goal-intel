"use client";

import { useGoalData } from "@/hooks/useGoalData";
import { format } from "date-fns";
import { PlusCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import clsx from "clsx";
import { GithubHeatmap } from "./GithubHeatmap";
import { AnalyticsChart } from "./AnalyticsChart";
import { AIInsights } from "./AIInsights";

export function GoalDashboard() {
  const { goals, logs, loading, handleUpdateLog, handleAddGoal } = useGoalData();
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: "", category: "Health", target: 1, targetType: "boolean" });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.name) return;
    const success = await handleAddGoal(newGoal);
    if (success) {
      setIsAddingGoal(false);
      setNewGoal({ name: "", category: "Health", target: 1, targetType: "boolean" });
    }
  };

  const today = format(new Date(), "yyyy-MM-dd");

  const { pendingToday, backlog, completedToday } = useMemo(() => {
    const pToday: any[] = [];
    const bLog: any[] = [];
    const cToday: any[] = [];

    goals.forEach(goal => {
      const allLogs = logs.filter(l => l.goalId === goal._id);
      const totalValue = allLogs.reduce((sum, l) => sum + l.value, 0);
      const isCompleted = totalValue >= goal.target;

      if (isCompleted) {
        const activeToday = allLogs.some(l => l.date === today && l.value > 0);
        if (activeToday) {
          cToday.push(goal);
        }
      } else {
        let createdDate = today;
        try {
          if (goal.createdAt) {
            createdDate = format(new Date(goal.createdAt), "yyyy-MM-dd");
          } else if (goal._id && goal._id.length >= 8) {
            const timestamp = parseInt(goal._id.substring(0, 8), 16);
            if (!isNaN(timestamp)) {
              createdDate = format(new Date(timestamp * 1000), "yyyy-MM-dd");
            }
          }
        } catch (e) {
          // silently fallback to today
        }
        
        if (createdDate < today) {
          bLog.push(goal);
        } else {
          pToday.push(goal);
        }
      }
    });

    return { pendingToday: pToday, backlog: bLog, completedToday: cToday };
  }, [goals, logs, today]);

  const renderGoalRow = (goal: any) => {
    const allLogs = logs.filter(l => l.goalId === goal._id);
    const totalValue = allLogs.reduce((sum, l) => sum + l.value, 0);
    const isCompleted = totalValue >= goal.target;
    // Current value specifically for today in case they want to adjust today's log
    const todayLogValue = allLogs.find(l => l.date === today)?.value || 0;

    return (
      <div key={goal._id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-medium flex items-center gap-2">
            {goal.name}
            <span className="text-[10px] bg-[#1F1F23] text-[var(--muted-foreground)] px-1.5 py-0.5 rounded flex-shrink-0">{goal.category}</span>
          </h3>
          {isCompleted ? (
            <div className="text-[var(--success)] font-bold text-sm mt-1">Done</div>
          ) : (
            <div className="text-[var(--warning)] text-sm mt-1">Pending</div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {goal.targetType === 'boolean' ? (
            <div className="flex items-center gap-1">
              <button 
                onClick={() => handleUpdateLog(goal._id, 1)}
                className={clsx(
                  "w-8 h-8 rounded-lg flex items-center justify-center font-medium transition-all text-xs",
                  todayLogValue >= 1 ? "bg-[var(--success)] text-white" : "bg-[var(--secondary)] hover:bg-[var(--border)]"
                )}
              >
                Yes
              </button>
              <button 
                onClick={() => handleUpdateLog(goal._id, 0)}
                className={clsx(
                  "w-8 h-8 rounded-lg flex items-center justify-center font-medium transition-all text-xs",
                  !isCompleted && totalValue === 0 && allLogs.some(l => l.date === today) ? "bg-red-500/20 text-[var(--error)]" : "bg-[var(--secondary)] hover:bg-[var(--border)]"
                )}
              >
                No
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleUpdateLog(goal._id, Math.max(0, todayLogValue - 1))}
                className="w-7 h-7 rounded-lg bg-[var(--secondary)] hover:bg-[var(--border)] flex items-center justify-center"
              >-</button>
              <span className="w-[60px] text-center font-mono font-medium text-sm flex items-center justify-center gap-1 whitespace-nowrap">
                {totalValue} <span className="text-[10px] text-[var(--muted-foreground)]">/ {goal.target}</span>
              </span>
              <button 
                onClick={() => handleUpdateLog(goal._id, todayLogValue + 1)}
                className="w-7 h-7 rounded-lg bg-[var(--secondary)] hover:bg-[var(--border)] flex items-center justify-center"
              >+</button>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[var(--muted-foreground)]" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-[var(--border)] pb-4">
        <div>
          <div className="text-xl font-bold tracking-tight flex items-center gap-2">
            GOAL<span className="text-[var(--accent)]">INTEL</span>
          </div>
          <p className="text-[var(--muted-foreground)] text-xs mt-1">Intelligence Tier: High</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsAddingGoal(true)}
            className="bg-[var(--accent)] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <PlusCircle className="w-4 h-4" />
            Add Goal
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--accent)] to-[#A855F7]"></div>
        </div>
      </header>

      <AnimatePresence>
        {isAddingGoal && (
          <motion.div 
            initial={{ opacity: 0, y: -20, height: 0 }} 
            animate={{ opacity: 1, y: 0, height: "auto" }} 
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 mb-8"
          >
            <h3 className="text-lg font-medium mb-4">Create New Goal</h3>
            <form onSubmit={onSubmit} className="flex flex-col md:flex-row items-end gap-4">
              <div className="flex-1 w-full space-y-1">
                <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase">Name</label>
                <input 
                  type="text" 
                  autoFocus
                  required
                  value={newGoal.name}
                  onChange={e => setNewGoal({...newGoal, name: e.target.value})}
                  placeholder="e.g. Morning Run" 
                  className="w-full text-sm h-10 px-3 rounded-md border border-[var(--border)] bg-transparent focus:outline-none focus:ring-1 focus:ring-[var(--foreground)]"
                />
              </div>
              <div className="w-full md:w-48 space-y-1">
                <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase">Category</label>
                <select 
                  value={newGoal.category}
                  onChange={e => setNewGoal({...newGoal, category: e.target.value})}
                  className="w-full text-sm h-10 px-3 rounded-md border border-[var(--border)] bg-transparent focus:outline-none focus:ring-1 focus:ring-[var(--foreground)]"
                >
                  <option>Health</option>
                  <option>Study</option>
                  <option>Work</option>
                  <option>Finance</option>
                  <option>Mindfulness</option>
                </select>
              </div>
              <div className="w-full md:w-32 space-y-1">
                <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase">Goal Type</label>
                <select 
                  value={newGoal.targetType}
                  onChange={e => setNewGoal({...newGoal, targetType: e.target.value as "boolean" | "number"})}
                  className="w-full text-sm h-10 px-3 rounded-md border border-[var(--border)] bg-transparent focus:outline-none focus:ring-1 focus:ring-[var(--foreground)]"
                >
                  <option value="boolean">Yes/No</option>
                  <option value="number">Numeric</option>
                </select>
              </div>
              {newGoal.targetType === "number" && (
                <div className="w-full md:w-32 space-y-1">
                  <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase">Target</label>
                  <input 
                    type="number" 
                    min={1}
                    required
                    value={newGoal.target}
                    onChange={e => setNewGoal({...newGoal, target: parseInt(e.target.value) || 1})}
                    className="w-full text-sm h-10 px-3 rounded-md border border-[var(--border)] bg-transparent focus:outline-none focus:ring-1 focus:ring-[var(--foreground)]"
                  />
                </div>
              )}
              <div className="flex gap-2 w-full md:w-auto">
                <button type="button" onClick={() => setIsAddingGoal(false)} className="px-4 h-10 rounded-md border border-[var(--border)] text-sm font-medium hover:bg-[var(--secondary)] flex-1">Cancel</button>
                <button type="submit" className="px-4 h-10 rounded-md bg-[var(--foreground)] text-[var(--background)] text-sm font-medium hover:opacity-90 flex-1">Save</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 auto-rows-min gap-4">
        
        {/* Tracker Section */}
        <div id="goals" className="col-span-1 lg:col-span-4 lg:row-span-2 scroll-mt-6">
          <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] h-full overflow-hidden flex flex-col p-5">
            <h2 className="text-[11px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] font-semibold mb-4">Active Goals</h2>
            {goals.length === 0 ? (
              <div className="text-center text-[var(--muted-foreground)] text-sm">
                No goals yet. Add one above to get started.
              </div>
            ) : (
              <div className="divide-y divide-[var(--border)] -mx-5 px-5 overflow-y-auto max-h-[800px]">
                {pendingToday.length > 0 && (
                  <div className="mb-2">
                    <h3 className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-wider mb-1 mt-4">Today</h3>
                    {pendingToday.map(renderGoalRow)}
                  </div>
                )}
                {backlog.length > 0 && (
                  <div className="mb-2 border-t border-[var(--border)] mt-2 pt-2">
                    <h3 className="text-[10px] font-bold text-[var(--warning)] uppercase tracking-wider mb-1 mt-2 flex items-center gap-2">
                      Backlog <span className="px-1.5 py-0.5 rounded-full bg-[var(--warning)]/10 text-[var(--warning)] text-[9px]">{backlog.length}</span>
                    </h3>
                    {backlog.map(renderGoalRow)}
                  </div>
                )}
                {completedToday.length > 0 && (
                  <div className="mb-2 border-t border-[var(--border)] mt-2 pt-2 opacity-60 hover:opacity-100 transition-opacity">
                    <h3 className="text-[10px] font-bold text-[var(--success)] uppercase tracking-wider mb-1 mt-2">Completed</h3>
                    {completedToday.map(renderGoalRow)}
                  </div>
                )}
                
                {pendingToday.length === 0 && backlog.length === 0 && completedToday.length > 0 && (
                  <div className="text-center text-[var(--success)] text-sm py-8 font-medium">
                    All clear! Great job today.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Analytics Chart */}
        <div id="analytics" className="col-span-1 lg:col-span-8 lg:row-span-1 scroll-mt-6">
          <AnalyticsChart goals={goals} logs={logs} />
        </div>

        {/* AI Insights */}
        <div id="insights" className="col-span-1 lg:col-span-8 lg:row-span-1 scroll-mt-6">
          <AIInsights goals={goals} logs={logs} />
        </div>

        {/* Activity Heatmap */}
        <div id="heatmap" className="col-span-1 lg:col-span-12 lg:row-span-1 bg-[var(--card)] rounded-2xl border border-[var(--border)] p-5 scroll-mt-6">
          <h2 className="text-[11px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] font-semibold mb-3">Goal Contribution Graph</h2>
          <GithubHeatmap goals={goals} logs={logs} />
        </div>

      </div>
    </div>
  );
}
