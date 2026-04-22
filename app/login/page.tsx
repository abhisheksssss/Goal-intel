"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        toast.success("Successfully logged in!");
        setTimeout(() => {
          window.location.href = "/";
        }, 800);
      } else {
        const data = await res.json();
        toast.error(data.error || data.message || "Failed to login");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
      <div className="w-full max-w-sm bg-[var(--card)] p-8 rounded-2xl border border-[var(--border)] shadow-2xl">
        <div className="text-center mb-8">
          <div className="text-2xl font-bold tracking-tight inline-flex items-center gap-2">
            GOAL<span className="text-[var(--accent)]">INTEL</span>
          </div>
          <p className="text-sm text-[var(--muted-foreground)] mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 px-3 text-sm rounded-md border border-[var(--border)] bg-transparent focus:outline-none focus:ring-1 focus:ring-[var(--foreground)]"
              placeholder="name@example.com"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 px-3 text-sm rounded-md border border-[var(--border)] bg-transparent focus:outline-none focus:ring-1 focus:ring-[var(--foreground)]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 mt-2 bg-[var(--accent)] text-white rounded-md text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-[var(--foreground)] hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
