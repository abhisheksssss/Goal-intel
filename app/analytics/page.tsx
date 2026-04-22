"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { AnalyticsChart } from "@/components/AnalyticsChart";
import { useGoalData } from "@/hooks/useGoalData";
import { Loader2 } from "lucide-react";

export default function AnalyticsPage() {
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

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-[var(--border)] pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
            <p className="text-[var(--muted-foreground)] text-sm mt-1">Review your weekly performance trends and metrics</p>
          </div>
        </header>

        <div className="h-[400px]">
          <AnalyticsChart goals={goals} logs={logs} />
        </div>
      </div>
    </DashboardLayout>
  );
}
