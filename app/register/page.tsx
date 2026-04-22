"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        toast.success("Registration successful!");
        setTimeout(() => {
          window.location.href = "/";
        }, 800);
      } else {
        const data = await res.json();
        toast.error(data.error || data.message || "Failed to register");
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
          <p className="text-sm text-[var(--muted-foreground)] mt-2">Create an account</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 px-3 text-sm rounded-md border border-[var(--border)] bg-transparent focus:outline-none focus:ring-1 focus:ring-[var(--foreground)]"
              placeholder="Alexander Chen"
            />
          </div>
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
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Register"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
          Already have an account?{" "}
          <Link href="/login" className="text-[var(--foreground)] hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
