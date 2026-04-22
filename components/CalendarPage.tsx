"use client";

import { useEffect, useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth, subMonths, addMonths } from "date-fns";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import clsx from "clsx";

export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
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

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getDayCompletionRank = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    let completed = 0;
    goals.forEach(goal => {
      const log = logs.find(l => l.goalId === goal._id && l.date === dateStr);
      if (log && log.value >= goal.target) completed++;
    });
    if (goals.length === 0 || completed === 0) return 0;
    const ratio = completed / goals.length;
    if (ratio < 0.3) return 1;
    if (ratio < 0.6) return 2;
    if (ratio < 0.9) return 3;
    return 4;
  };

  if (loading) {
    return <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[var(--accent)]" /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <header className="flex justify-between items-center mb-8 border-b border-[var(--border)] pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
          <p className="text-[var(--muted-foreground)] text-sm mt-1">Review your habit streaks over time.</p>
        </div>
        <div className="flex items-center gap-4 bg-[var(--card)] px-4 py-2 rounded-xl border border-[var(--border)]">
          <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="hover:text-[var(--accent)]"><ChevronLeft className="w-5 h-5"/></button>
          <span className="font-medium text-sm w-32 text-center">{format(currentDate, "MMMM yyyy")}</span>
          <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="hover:text-[var(--accent)]"><ChevronRight className="w-5 h-5"/></button>
        </div>
      </header>

      <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
        <div className="grid grid-cols-7 gap-4 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="text-center text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-4">
          {/* Pad the beginning of the month */}
          {Array.from({ length: monthStart.getDay() }).map((_, i) => (
            <div key={`pad-${i}`} className="aspect-square" />
          ))}
          
          {daysInMonth.map(day => {
            const rank = getDayCompletionRank(day);
            return (
              <div 
                key={day.toISOString()} 
                className={clsx(
                  "aspect-square rounded-xl p-2 flex flex-col justify-between border",
                  isToday(day) ? "border-[var(--accent)]" : "border-[var(--border)]",
                  !isSameMonth(day, currentDate) && "opacity-30"
                )}
              >
                <span className={clsx("text-sm font-medium", isToday(day) && "text-[var(--accent)]")}>
                  {format(day, "d")}
                </span>
                
                <div className="flex justify-end pt-2">
                  <div className={clsx(
                    "w-4 h-4 rounded-sm",
                    rank === 0 && "bg-[#1F1F23]",
                    rank === 1 && "bg-[#312E81]",
                    rank === 2 && "bg-[#4338CA]",
                    rank === 3 && "bg-[#6366F1]",
                    rank === 4 && "bg-[#818CF8]"
                  )} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
