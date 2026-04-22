import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_development";

export async function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export async function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch (error) {
    return null;
  }
}

export async function getUserFromCookies() {
  // Return a mock user id if no MongoDB URI is set for graceful degradation in preview
  if (!process.env.MONGODB_URI) {
    return { userId: "mock_user_id_" + Math.random().toString(36).substring(7) };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return null;

  const decoded = await verifyToken(token);
  return decoded ? { userId: decoded.userId } : null;
}
