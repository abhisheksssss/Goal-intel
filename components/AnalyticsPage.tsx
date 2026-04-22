"use client";

import { useEffect, useState, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";
import { AnalyticsChart } from "./AnalyticsChart";
import { Loader2 } from "lucide-react";

export function AnalyticsPage() {
  const [goals, setGoals] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [goalsRes, logsRes] = await Promise.all([
          fetch("/api/goals"),
          fetch("/api/logs")
        ]);
        if (goalsRes.ok && logsRes.ok) {
          setGoals(await goalsRes.json());
          setLogs(await logsRes.json());
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    goals.forEach(g => {
      counts[g.category] = (counts[g.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [goals]);

  const COLORS = ['#6366F1', '#818CF8', '#A855F7', '#D946EF', '#F43F5E'];

  if (loading) {
    return <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[var(--accent)]" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <header className="mb-8 border-b border-[var(--border)] pb-4">
        <h1 className="text-2xl font-bold tracking-tight">Full Analytics</h1>
        <p className="text-[var(--muted-foreground)] text-sm mt-1">Deep dive into your performance patterns.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6 h-[400px]">
          <h2 className="text-[11px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] font-semibold mb-6">Goals by Category</h2>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={categoryData}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--card)' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-[var(--muted-foreground)] text-sm">No data available.</div>
          )}
        </div>

        <div className="h-[400px]">
          <AnalyticsChart goals={goals} logs={logs} />
        </div>
      </div>
    </div>
  );
}
