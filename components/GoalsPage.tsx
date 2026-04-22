"use client";

import { useEffect, useState } from "react";
import { Loader2, Trash2 } from "lucide-react";

type Goal = {
  _id: string;
  name: string;
  category: string;
  target: number;
  targetType: "number" | "boolean";
};

export function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await fetch("/api/goals");
        if (res.ok) setGoals(await res.json());
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchGoals();
  }, []);

  const deleteGoal = async (id: string) => {
    if (!confirm("Are you sure you want to delete this goal and all its data?")) return;
    try {
      await fetch(`/api/goals/${id}`, { method: "DELETE" });
      setGoals(goals.filter(g => g._id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[var(--accent)]" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <header className="mb-8 border-b border-[var(--border)] pb-4">
        <h1 className="text-2xl font-bold tracking-tight">Manage Goals</h1>
        <p className="text-[var(--muted-foreground)] text-sm mt-1">View and organize your defined goals.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map(goal => (
          <div key={goal._id} className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg">{goal.name}</h3>
                <span className="text-[10px] bg-[#1F1F23] text-[var(--muted-foreground)] px-2 py-1 rounded-md uppercase tracking-wider">{goal.category}</span>
              </div>
              <p className="text-sm text-[var(--muted-foreground)] mt-2">
                Daily Target: {goal.targetType === 'boolean' ? 'Completion' : goal.target}
              </p>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => deleteGoal(goal._id)}
                className="text-sm flex items-center gap-2 text-[var(--error)] hover:opacity-80 transition-opacity"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        ))}
        {goals.length === 0 && (
          <div className="col-span-full p-8 text-center text-[var(--muted-foreground)]">
            No active goals. Add them from the dashboard.
          </div>
        )}
      </div>
    </div>
  );
}
