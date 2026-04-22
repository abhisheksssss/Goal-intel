"use client";

import { useEffect, useState } from "react";
import { Sparkles, Loader2, RefreshCw } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from "react-markdown";

export function InsightsPage() {
  const [goals, setGoals] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

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

  const generateExtensiveInsight = async () => {
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      setInsight("Gemini API key is not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY to your env.");
      return;
    }
    
    setGenerating(true);
    setInsight(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      
      const payload = JSON.stringify({ goals, logs });
      const prompt = `You are a world-class performance coach analyzing a client's habit tracking data. Provide a detailed, highly structured intelligence report. Use markdown with clear headings, bullet points, and bold text. 
Address the following areas:
1. Executive Summary: The overall performance trend.
2. Streaks and Consistency: What's working well?
3. Vulnerabilities: Identify days, times, or categories where consistency breaks down.
4. Actionable Directives: Provide 3 concrete suggestions to improve specific habits.

Data: ${payload}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview", // Use a top-tier model for detailed analysis
        contents: prompt,
        config: {
          systemInstruction: "You are an analytical, data-driven productivity coach.",
        }
      });

      setInsight(response.text ?? "No insights were generated this time. Try again.");
    } catch (e: any) {
      console.error(e);
      setInsight("Failed to generate comprehensive insights. Check your API key or console for details.");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[var(--accent)]" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <header className="flex justify-between items-end mb-8 border-b border-[var(--border)] pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Intelligence Report</h1>
          <p className="text-[var(--muted-foreground)] text-sm mt-1">Deep analysis of your performance metrics.</p>
        </div>
        <button 
          onClick={generateExtensiveInsight}
          disabled={generating || goals.length === 0}
          className="bg-[var(--accent)] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Generate Full Report
        </button>
      </header>

      <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-8 relative overflow-hidden min-h-[400px]">
        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
          <Sparkles className="w-48 h-48" />
        </div>
        
        {generating ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--accent)]" />
            <p className="text-[var(--muted-foreground)] text-sm animate-pulse">Running advanced pattern recognition algorithms...</p>
          </div>
        ) : insight ? (
          <div className="prose prose-invert max-w-none text-[var(--foreground)] leading-relaxed markdown-body">
            <ReactMarkdown>{insight}</ReactMarkdown>
          </div>
        ) : (
           <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center">
             <div className="w-16 h-16 rounded-full bg-[var(--secondary)] flex items-center justify-center mb-2">
               <Sparkles className="w-8 h-8 text-[var(--muted-foreground)]" />
             </div>
             <h3 className="text-lg font-medium">No Intelligence Report Available</h3>
             <p className="text-[var(--muted-foreground)] text-sm max-w-md">
               {goals.length === 0 
                  ? "Track some goals first." 
                  : "Click the button above to synthesize a customized performance evaluation based on your historical data."}
             </p>
           </div>
        )}
      </div>
    </div>
  );
}
