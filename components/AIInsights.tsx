"use client";

import { useState } from "react";
import { Sparkles, Loader2, RefreshCw } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from "react-markdown";

export function AIInsights({ goals, logs }: { goals: any[], logs: any[] }) {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateInsight = async () => {
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      setInsight("Gemini API key is not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY to your env.");
      return;
    }
    
    setLoading(true);
    setInsight(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      
      const payload = JSON.stringify({ goals, logs });
      const prompt = `You are an expert productivity coach. Analyze the following user goal tracking data.
Give 2-3 short, highly actionable insights. Use markdown. Keep it very concise and punchy.
Identify streaks, burnout patterns, or specific days where performance drops.

Data: ${payload}`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction: "You provide short, encouraging, and data-driven productivity insights.",
        }
      });

      setInsight(response.text ?? "No insights were generated this time. Try again.");
    } catch (e: any) {
      console.error(e);
      setInsight("Failed to generate insights. Check your API key or console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-5 h-full flex flex-col relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[11px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] font-semibold flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[var(--warning)]" />
            Smart Insights & Recommendations
          </h2>
          <button 
            onClick={generateInsight}
            disabled={loading || goals.length === 0}
            className="w-7 h-7 rounded bg-[var(--secondary)] hover:bg-[var(--border)] flex items-center justify-center transition-colors disabled:opacity-50 text-[var(--foreground)]"
            title="Generate Insight"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="min-h-[100px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-3 py-6 opacity-80">
              <Loader2 className="w-6 h-6 animate-spin text-[var(--accent)]" />
              <p className="text-sm">Analyzing your performance...</p>
            </div>
          ) : insight ? (
             <div className="p-4 bg-[#1A1A1D] rounded-[10px] border-l-[3px] border-l-[var(--accent)]">
               <div className="prose prose-sm prose-invert max-w-none text-sm text-[var(--foreground)] leading-relaxed markdown-body">
                  <ReactMarkdown>{insight}</ReactMarkdown>
               </div>
             </div>
          ) : (
            <div className="text-sm opacity-80 text-[var(--muted-foreground)] py-4">
              {goals.length === 0 
                ? "Add some goals and log data to generate intelligent insights." 
                : "Click the refresh button to generate personalized performance insights based on your recent activity."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
