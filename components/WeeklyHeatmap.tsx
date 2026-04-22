"use client";

import { subDays, format } from "date-fns";
import clsx from "clsx";

export function WeeklyHeatmap({ goals, logs }: { goals: any[], logs: any[] }) {
  // Generate last 28 days
  const days = Array.from({ length: 28 }).map((_, i) => format(subDays(new Date(), 27 - i), "yyyy-MM-dd"));

  if (goals.length === 0) {
    return <div className="text-sm text-[var(--muted-foreground)]">Add goals to see your heatmap.</div>;
  }

  // Calculate intensity per day (0-4)
  const getIntensity = (date: string) => {
    let completed = 0;
    goals.forEach(goal => {
      const log = logs.find(l => l.goalId === goal._id && l.date === date);
      if (log && log.value >= goal.target) {
        completed++;
      }
    });
    if (completed === 0) return 0;
    const ratio = completed / goals.length;
    if (ratio < 0.3) return 1;
    if (ratio < 0.6) return 2;
    if (ratio < 0.9) return 3;
    return 4;
  };

  return (
    <div>
      <div className="grid grid-cols-7 gap-1">
        {days.map(day => {
          const intensity = getIntensity(day);
          return (
            <div 
              key={day}
              title={`${day}: Intensity ${intensity}`}
              className={clsx(
                "aspect-square rounded-[2px] transition-colors",
                intensity === 0 && "bg-[#1F1F23]",
                intensity === 1 && "bg-[#312E81]",
                intensity === 2 && "bg-[#4338CA]",
                intensity === 3 && "bg-[#6366F1]",
                intensity === 4 && "bg-[#818CF8]",
              )}
            />
          );
        })}
      </div>
      <div className="flex justify-between items-center mt-3 text-[10px] uppercase font-bold text-[var(--muted-foreground)]">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-[2px] bg-[#1F1F23]"></div>
          <div className="w-3 h-3 rounded-[2px] bg-[#312E81]"></div>
          <div className="w-3 h-3 rounded-[2px] bg-[#4338CA]"></div>
          <div className="w-3 h-3 rounded-[2px] bg-[#6366F1]"></div>
          <div className="w-3 h-3 rounded-[2px] bg-[#818CF8]"></div>
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
