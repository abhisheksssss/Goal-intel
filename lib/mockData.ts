import { format, subDays, addDays } from "date-fns";

export const MOCK_GOALS = [
  { _id: "g1", name: "Morning Run", category: "Health", target: 1, targetType: "boolean" },
  { _id: "g2", name: "Read 30 pages", category: "Study", target: 30, targetType: "number" },
  { _id: "g3", name: "Deep Work", category: "Work", target: 4, targetType: "number" },
];

export const MOCK_LOGS: any[] = [];

// Generate last 30 days of logs
for (let i = 0; i < 30; i++) {
  const dateStr = format(subDays(new Date(), i), "yyyy-MM-dd");
  
  // Randomly success or fail goals
  if (Math.random() > 0.3) MOCK_LOGS.push({ goalId: "g1", date: dateStr, value: 1 });
  if (Math.random() > 0.2) MOCK_LOGS.push({ goalId: "g2", date: dateStr, value: Math.floor(Math.random() * 20) + 10 });
  if (Math.random() > 0.4) MOCK_LOGS.push({ goalId: "g3", date: dateStr, value: Math.floor(Math.random() * 4) + 1 });
}
