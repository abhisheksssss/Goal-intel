"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { AIInsights } from "@/components/AIInsights";
import { useGoalData } from "@/hooks/useGoalData";
import { Loader2 } from "lucide-react";

export default function InsightsPage() {
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
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-[var(--border)] pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AI Insights</h1>
            <p className="text-[var(--muted-foreground)] text-sm mt-1">Get personalized strategy feedback from Gemini</p>
          </div>
        </header>

        <AIInsights goals={goals} logs={logs} />
      </div>
    </DashboardLayout>
  );
}
