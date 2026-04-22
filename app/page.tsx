import { DashboardLayout } from "@/components/DashboardLayout";
import { GoalDashboard } from "@/components/GoalDashboard";

export default function Home() {
  return (
    <DashboardLayout>
      <GoalDashboard />
    </DashboardLayout>
  );
}
