import { Sidebar } from "@/components/Sidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-[var(--background)] min-h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 h-screen overflow-y-auto w-full bg-[#0E0E11]">
        {children}
      </main>
    </div>
  );
}
