import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { z } from "zod";

const SessionUserSchema = z.object({
  id: z.string(),
  name: z.string().default("Pengguna"),
  email: z.string(),
  role: z.enum(["ADMIN", "CASHIER"]).default("CASHIER"),
  isActive: z.boolean().default(true),
});

export type SessionUser = z.infer<typeof SessionUserSchema>;

export async function getCurrentSession(): Promise<{
  user: SessionUser | null;
  session: unknown | null;
}> {
  try {
    const headerList = await headers();
    const sessionRes = await auth.api.getSession({
      headers: headerList,
    });

    if (!sessionRes || !sessionRes.user) {
      return { user: null, session: null };
    }

    const parsed = SessionUserSchema.safeParse(sessionRes.user);
    if (!parsed.success) {
      return { user: null, session: null };
    }
    const user: SessionUser = parsed.data;
    return {
      user,
      session: sessionRes.session,
    };
  } catch (error) {
    console.error("Failed to get session:", error);
    return { user: null, session: null };
  }
}

export async function requireAuth(): Promise<SessionUser> {
  const { user } = await getCurrentSession();
  if (!user || !user.isActive) {
    redirect("/login");
  }
  return user;
}

export async function requireRole(allowedRoles: ("ADMIN" | "CASHIER")[]): Promise<SessionUser> {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) {
    // If cashier tries to access admin-only route, redirect to /pos
    if (user.role === "CASHIER") {
      redirect("/pos");
    }
    redirect("/login");
  }
  return user;
}
