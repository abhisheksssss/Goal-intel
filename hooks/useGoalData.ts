"use client";

import { useEffect, useState, useMemo } from "react";
import { format } from "date-fns";

export type Goal = {
  _id: string;
  name: string;
  category: string;
  target: number;
  targetType: "number" | "boolean";
  createdAt?: string;
};

export type Log = {
  goalId: string;
  date: string;
  value: number;
};

export function useGoalData() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
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
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateLog = async (goalId: string, value: number) => {
    const today = format(new Date(), "yyyy-MM-dd");
    
    const updatedLogs = [...logs];
    const existingIdx = updatedLogs.findIndex(l => l.goalId === goalId && l.date === today);
    if (existingIdx > -1) {
      updatedLogs[existingIdx].value = value;
    } else {
      updatedLogs.push({ goalId, date: today, value });
    }
    setLogs(updatedLogs);

    await fetch("/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goalId, date: today, value })
    });
  };

  const handleAddGoal = async (newGoal: any) => {
    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGoal)
      });
      if (res.ok) {
        const goal = await res.json();
        setGoals([goal, ...goals]);
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  return { goals, logs, loading, handleUpdateLog, handleAddGoal };
}
