import { cookies } from "next/headers";

const cookieName = "nano_gro_admin";

export async function isAdminAuthenticated() {
  const store = await cookies();
  return store.get(cookieName)?.value === "1";
}

export async function setAdminSession() {
  const store = await cookies();
  store.set(cookieName, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(cookieName);
}
