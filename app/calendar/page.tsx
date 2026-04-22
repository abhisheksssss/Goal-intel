import { Sidebar } from "@/components/Sidebar";
import { CalendarPage } from "@/components/CalendarPage";

export default function CalendarRoute() {
  return (
    <div className="flex bg-[var(--background)] min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 h-screen overflow-y-auto w-full">
        <CalendarPage />
      </main>
    </div>
  );
}
