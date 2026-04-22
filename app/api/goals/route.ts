import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Goal from "@/models/Goal";
import { getUserFromCookies } from "@/lib/auth";
import { MOCK_GOALS } from "@/lib/mockData";

export async function GET() {
  const db = await connectDB();
  if (!db) {
    return NextResponse.json(MOCK_GOALS);
  }

  const user = await getUserFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const goals = await Goal.find({ userId: user.userId }).sort({ createdAt: -1 });
  return NextResponse.json(goals);
}

export async function POST(req: Request) {
  const db = await connectDB();
  if (!db) return NextResponse.json({ error: "Storage not configured." }, { status: 503 });

  const user = await getUserFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const goal = await Goal.create({ ...body, userId: user.userId });
  
  return NextResponse.json(goal);
}
