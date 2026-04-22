"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { GithubHeatmap } from "@/components/GithubHeatmap";
import { useGoalData } from "@/hooks/useGoalData";
import { format, isSameDay } from "date-fns";
import { DayPicker } from "react-day-picker";
import { Loader2 } from "lucide-react";
import "react-day-picker/dist/style.css";

export default function ActivityPage() {
  const { goals, logs, loading } = useGoalData();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="h-full flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--muted-foreground)]" />
        </div>
      </DashboardLayout>
    );
  }

  // Figure out the days where any activity was recorded for the calendar
  const activeDays = logs.filter(l => l.value > 0).map(l => new Date(l.date));

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-[var(--border)] pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Activity</h1>
            <p className="text-[var(--muted-foreground)] text-sm mt-1">Track your performance history and intensity</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-5 flex justify-center items-center">
             <style dangerouslySetInnerHTML={{__html: `
              .rdp { --rdp-cell-size: 40px; --rdp-accent-color: var(--accent); }
              .rdp-day_selected { background-color: var(--accent); color: white; font-weight: bold; }
              .active-day:not(.rdp-day_selected) { color: var(--accent); font-weight: bold; background: rgba(168, 85, 247, 0.1); border-radius: 100%; border: 1px solid var(--accent); }
            `}} />
            <DayPicker
              mode="single"
              selected={new Date()}
              modifiers={{ active: activeDays }}
              modifiersClassNames={{ active: "active-day" }}
              className="font-sans text-[var(--foreground)]"
            />
          </div>

          <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-5 flex flex-col justify-center">
             <h2 className="text-[11px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] font-semibold mb-6">Annual Heatmap</h2>
             <GithubHeatmap goals={goals} logs={logs} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
