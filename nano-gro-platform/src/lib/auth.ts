import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

// Lightweight session auth: a signed JWT in an httpOnly cookie + role-based access.
// Intentionally small and self-contained for the admin (few internal users); can be
// swapped for Auth.js later without changing call sites (getSession / requireRole).

export type Role = "ADMIN" | "EDITOR" | "AGRONOMIST";

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: Role;
}

const COOKIE = "ng_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secret(): Uint8Array {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) {
    throw new Error("AUTH_SECRET is missing or too short");
  }
  return new TextEncoder().encode(s);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(user: SessionUser): Promise<void> {
  const token = await new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());

  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return {
      id: String(payload.id),
      email: String(payload.email),
      name: (payload.name as string) ?? null,
      role: payload.role as Role,
    };
  } catch {
    return null;
  }
}

// Role hierarchy for access checks.
const RANK: Record<Role, number> = { AGRONOMIST: 1, EDITOR: 2, ADMIN: 3 };

export function hasRole(user: SessionUser | null, min: Role): boolean {
  return !!user && RANK[user.role] >= RANK[min];
}
