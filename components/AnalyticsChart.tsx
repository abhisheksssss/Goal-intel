"use client";

import { useMemo } from "react";
import { format, subDays } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function AnalyticsChart({ goals, logs }: { goals: any[], logs: any[] }) {
  const data = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const dateStr = format(subDays(new Date(), 6 - i), "yyyy-MM-dd");
      
      let completed = 0;
      goals.forEach(goal => {
        const allLogsBeforeOrOnDate = logs.filter(l => l.goalId === goal._id && l.date <= dateStr);
        const totalValue = allLogsBeforeOrOnDate.reduce((sum, l) => sum + l.value, 0);
        if (totalValue >= goal.target) completed++;
      });
      
      return {
        name: format(subDays(new Date(), 6 - i), "EEE"), // Mon, Tue
        completion: goals.length > 0 ? Math.round((completed / goals.length) * 100) : 0
      };
    });
  }, [goals, logs]);

  return (
    <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-5 h-full min-h-[280px] flex flex-col">
      <h2 className="text-[11px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] font-semibold mb-6">Weekly Performance Trends</h2>
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} dx={-10} domain={[0, 100]} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--foreground)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ color: 'var(--accent)' }}
              formatter={(value) => [`${value}%`, 'Completion']}
            />
            <Line 
              type="monotone" 
              dataKey="completion" 
              stroke="var(--accent)" 
              strokeWidth={3} 
              dot={{ strokeWidth: 2, r: 4, stroke: "var(--accent)", fill: "var(--card)" }} 
              activeDot={{ r: 6, fill: "var(--accent)" }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
