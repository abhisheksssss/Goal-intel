import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import GoalLog from "@/models/GoalLog";
import { getUserFromCookies } from "@/lib/auth";
import { MOCK_LOGS } from "@/lib/mockData";

export async function GET() {
  const db = await connectDB();
  if (!db) {
    return NextResponse.json(MOCK_LOGS);
  }

  const user = await getUserFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const logs = await GoalLog.find({ userId: user.userId }).sort({ date: 1 });
  return NextResponse.json(logs);
}

export async function POST(req: Request) {
  const db = await connectDB();
  if (!db) return NextResponse.json({ error: "Storage not configured." }, { status: 503 });

  const user = await getUserFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { goalId, date, value } = await req.json();

  // Upsert the log
  const log = await GoalLog.findOneAndUpdate(
    { userId: user.userId, goalId, date },
    { value },
    { upsert: true, returnDocument: "after" }
  );
  
  return NextResponse.json(log);
}
