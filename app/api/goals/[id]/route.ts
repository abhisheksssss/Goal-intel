import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Goal from "@/models/Goal";
import { getUserFromCookies } from "@/lib/auth";

export async function DELETE(req: Request) {
  const db = await connectDB();
  if (!db) return NextResponse.json({ error: "Storage not configured." }, { status: 503 });

  const user = await getUserFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  await Goal.findOneAndDelete({ _id: id, userId: user.userId });
  return NextResponse.json({ success: true });
}
