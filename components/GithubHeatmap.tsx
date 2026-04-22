"use client";

import { useMemo } from "react";
import { format, startOfWeek, subDays, eachDayOfInterval } from "date-fns";
import clsx from "clsx";

export function GithubHeatmap({ goals, logs }: { goals: any[], logs: any[] }) {
  const { weeks, monthLabels } = useMemo(() => {
    const today = new Date();
    // Start exactly 365 days ago on a Sunday to ensure alignment
    const past = subDays(today, 365);
    const startDate = startOfWeek(past);
    
    const days = eachDayOfInterval({ start: startDate, end: today });
    
    const weeksArray: string[][] = [];
    const months: { label: string; weekIndex: number }[] = [];
    
    let currentWeek: string[] = [];
    let currentMonth = -1;

    days.forEach((day, index) => {
      currentWeek.push(format(day, "yyyy-MM-dd"));
      
      if (currentWeek.length === 1) { // Record month on the first day of the week column
        const month = day.getMonth();
        if (month !== currentMonth) {
          // Avoid spamming the very first column if it's the end of a month
          if (index > 0 || day.getDate() < 15) {
            months.push({ label: format(day, "MMM"), weekIndex: weeksArray.length });
          }
          currentMonth = month;
        }
      }

      if (currentWeek.length === 7 || index === days.length - 1) {
        weeksArray.push(currentWeek);
        currentWeek = [];
      }
    });

    return { weeks: weeksArray, monthLabels: months };
  }, []);

  const getIntensity = (date: string) => {
    let activeGoalsCount = 0;
    let dailyActivityScore = 0;
    
    goals.forEach(goal => {
      // Calculate if the goal was actually created before or on this specific day
      let createdDate = format(new Date(), "yyyy-MM-dd"); // secure default
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
        // silently fallback
      }
      
      if (createdDate <= date) {
        activeGoalsCount++;
        // Check logs for this specific day
        const log = logs.find(l => l.goalId === goal._id && l.date === date);
        if (log && log.value > 0) {
          dailyActivityScore++;
        }
      }
    });

    if (dailyActivityScore === 0) return 0;
    
    // Calculate the ratio based *only* on goals that existed on that day
    const ratio = dailyActivityScore / Math.max(1, activeGoalsCount);
    
    if (ratio < 0.25) return 1;
    if (ratio < 0.5) return 2;
    if (ratio < 0.75) return 3;
    return 4;
  };

  return (
    <div className="w-full overflow-x-auto scrollbar-hide pb-2" dir="ltr">
      <div className="min-w-max pr-4">
        {/* Months Header Row */}
        <div className="flex text-xs text-[var(--muted-foreground)] mb-2 relative h-4">
          {monthLabels.map((m, i) => (
            <div 
              key={i} 
              className="absolute text-[10px] font-medium"
              style={{ left: `${m.weekIndex * 17}px` }} 
            >
              {m.label}
            </div>
          ))}
        </div>

        {/* Heatmap Grid */}
        <div className="flex gap-1.5">
          {weeks.map((week, wIndex) => (
            <div key={wIndex} className="flex flex-col gap-1.5">
              {week.map(day => {
                const intensity = getIntensity(day);
                return (
                  <div 
                    key={day}
                    title={`${day}: ${intensity > 0 ? "Activity level " + intensity : "No activity"}`}
                    className={clsx(
                      "w-[11px] h-[11px] rounded-[2px] transition-colors",
                      intensity === 0 && "bg-[#1F1F23]", // Empty state
                      intensity === 1 && "bg-[var(--accent)] opacity-40",
                      intensity === 2 && "bg-[var(--accent)] opacity-60",
                      intensity === 3 && "bg-[var(--accent)] opacity-80",
                      intensity === 4 && "bg-[var(--accent)] opacity-100",
                    )}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer Legend */}
      <div className="flex justify-between items-center mt-4 text-[10px] uppercase font-bold text-[var(--muted-foreground)] border-t border-[var(--border)] pt-3">
        <span>Last 365 Days</span>
        <div className="flex gap-1.5 items-center">
          <span className="mr-1">Less</span>
          <div className="w-2.5 h-2.5 rounded-[2px] bg-[#1F1F23]"></div>
          <div className="w-2.5 h-2.5 rounded-[2px] bg-[var(--accent)] opacity-40"></div>
          <div className="w-2.5 h-2.5 rounded-[2px] bg-[var(--accent)] opacity-60"></div>
          <div className="w-2.5 h-2.5 rounded-[2px] bg-[var(--accent)] opacity-80"></div>
          <div className="w-2.5 h-2.5 rounded-[2px] bg-[var(--accent)] opacity-100"></div>
          <span className="ml-1">More</span>
        </div>
      </div>
    </div>
  );
}
